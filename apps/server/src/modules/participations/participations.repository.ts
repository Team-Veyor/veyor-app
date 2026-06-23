import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { SurveyCompleteFailureReason } from '@veyor/shared';
import { SupabaseService } from '../../core/supabase/supabase.service';

export interface ParticipationRow {
  id: string;
  survey_id: string;
  completed_at: string;
}

export interface ParticipationListItem {
  id: string;
  completed_at: string;
  survey: { title: string } | null;
  reward: { amount: number; status: string } | null;
}

/**
 * participations + rewards 테이블 접근 캡슐화.
 * 서버는 secret key(admin)로 접근하므로 모든 쿼리에 user_id 조건을 명시해 소유권을 강제한다.
 */
@Injectable()
export class ParticipationsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  /**
   * 참여 시작: status='started' 선기록. 멱등 — 이미 기록 있으면 기존 상태 반환.
   * (외부 설문 이동 직전 호출. 완료 인증의 전제)
   */
  async start(
    userId: string,
    surveyId: string,
  ): Promise<{ participationId: string; status: string }> {
    const existing = await this.findOwn(userId, surveyId);
    if (existing) {
      return { participationId: existing.id, status: existing.status };
    }
    const { data, error } = await this.db
      .from('participations')
      .insert({ user_id: userId, survey_id: surveyId, status: 'started' })
      .select('id, status')
      .single();
    if (error) {
      // 23505 = 동시 요청 경쟁: 이미 생성됨 → 재조회
      if (error.code === '23505') {
        const row = await this.findOwn(userId, surveyId);
        if (row) {
          return { participationId: row.id, status: row.status };
        }
      }
      throw new InternalServerErrorException('참여를 시작할 수 없습니다. 다시 시도해주세요.');
    }
    return { participationId: data.id, status: data.status as string };
  }

  /**
   * 완료 인증: start 기록(started)을 completed로 전이 + 리워드(pending) 생성.
   * - start 기록 없음 → BadRequest(400) complete_unavailable (직접 호출 차단, 일반 메시지)
   * - 이미 completed → Conflict(409) already_participated
   * - 모집 정원(recruitLimit) 마감 → Conflict(409) target_response_count
   *   (정원 검사는 start 게이트·중복 게이트 통과 뒤에 두어, 비참여자/중복자에게 마감 정보를 노출하지 않는다)
   */
  async completeFromStarted(
    userId: string,
    surveyId: string,
    rewardAmount: number,
    recruitLimit: number | null = null,
  ): Promise<{ participationId: string }> {
    const existing = await this.findOwn(userId, surveyId);
    if (!existing) {
      // 사유(start 기록 없음)를 사용자에게 숨긴다. 코드명도 중립(complete_unavailable)이라 노출돼도 단서가 안 된다.
      throw new BadRequestException({
        code: 'complete_unavailable' satisfies SurveyCompleteFailureReason,
        message: '설문을 완료할 수 없습니다.',
      });
    }
    if (existing.status === 'completed') {
      throw new ConflictException({
        code: 'already_participated' satisfies SurveyCompleteFailureReason,
        message: '이미 참여한 설문입니다.',
      });
    }

    // 모집 정원 마감 검사(정원 설정 시에만). 본인은 아직 started(미완료)라 카운트에 포함되지 않는다.
    // 주의(TOCTOU): count→전이가 원자적이지 않아, 정원 경계에서 동시 완료가 겹치면 소폭 초과될 수 있다
    // (저동시성에선 사실상 미발생). 하드 보장이 필요하면 count+전이를 단일 트랜잭션/RPC로 묶어야 하며,
    // 현재는 초과분을 정산 단계(어드민)에서 캡(cap)하는 것을 백스톱으로 둔다.
    if (recruitLimit != null) {
      const completedCount = await this.countCompletedBySurvey(surveyId);
      if (completedCount >= recruitLimit) {
        throw new ConflictException({
          code: 'target_response_count' satisfies SurveyCompleteFailureReason,
          message: '모집이 마감된 설문입니다.',
        });
      }
    }

    // started → completed (조건부 갱신으로 동시성 보호)
    const { data: updated, error: updateError } = await this.db
      .from('participations')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', existing.id)
      .eq('status', 'started')
      .select('id')
      .maybeSingle();
    if (updateError) {
      throw new InternalServerErrorException('인증할 수 없습니다. 다시 시도해주세요.');
    }
    if (!updated) {
      // 다른 요청이 먼저 완료 처리함
      throw new ConflictException({
        code: 'already_participated' satisfies SurveyCompleteFailureReason,
        message: '이미 참여한 설문입니다.',
      });
    }

    const { error: rewardError } = await this.db.from('rewards').insert({
      participation_id: existing.id,
      user_id: userId,
      amount: rewardAmount,
      status: 'pending',
    });
    if (rewardError) {
      if (rewardError.code === '23505') {
        // 이미 리워드 존재 → 이미 완료된 참여
        throw new ConflictException({
          code: 'already_participated' satisfies SurveyCompleteFailureReason,
          message: '이미 참여한 설문입니다.',
        });
      }
      // 리워드 실패 시 started로 롤백(보상 없는 완료 방지)
      await this.db
        .from('participations')
        .update({ status: 'started', completed_at: null })
        .eq('id', existing.id);
      throw new InternalServerErrorException('인증할 수 없습니다. 다시 시도해주세요.');
    }

    return { participationId: existing.id };
  }

  /** 본인 참여 1건 조회(없으면 null). */
  private async findOwn(
    userId: string,
    surveyId: string,
  ): Promise<{ id: string; status: string } | null> {
    const { data } = await this.db
      .from('participations')
      .select('id, status')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .maybeSingle();
    return (data as { id: string; status: string }) ?? null;
  }

  /** 특정 설문의 완료 참여 수(전역 집계). 모집 정원 마감 판정용. user_id 조건 없이 전체를 센다. */
  async countCompletedBySurvey(surveyId: string): Promise<number> {
    const { count, error } = await this.db
      .from('participations')
      .select('id', { count: 'exact', head: true })
      .eq('survey_id', surveyId)
      .eq('status', 'completed');
    if (error) {
      throw new InternalServerErrorException('집계를 불러오지 못했습니다.');
    }
    return count ?? 0;
  }

  /** 완료 여부(홈 '참여함' 표시용). started만 한 상태는 false. */
  async hasCompleted(userId: string, surveyId: string): Promise<boolean> {
    const { data } = await this.db
      .from('participations')
      .select('id')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .eq('status', 'completed')
      .maybeSingle();
    return !!data;
  }

  /**
   * 특정 설문 참여 여부 + 리워드 지급 상태.
   * participated 는 **완료(completed)** 기준 — 시작만(started) 한 상태는 false.
   */
  async getParticipationStatus(
    userId: string,
    surveyId: string,
  ): Promise<{ participated: boolean; rewardStatus: string | null }> {
    const { data } = await this.db
      .from('participations')
      .select('status, reward:rewards(status)')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .maybeSingle();

    if (!data) {
      return { participated: false, rewardStatus: null };
    }
    const row = data as Record<string, unknown>;
    const reward = Array.isArray(row.reward) ? row.reward[0] : row.reward;
    return {
      participated: row.status === 'completed',
      rewardStatus: (reward as { status: string } | null)?.status ?? null,
    };
  }

  /** 기간 내 참여 목록(설문 제목·리워드 포함). from/to는 ISO 문자열. */
  async listByUser(userId: string, from?: string, to?: string): Promise<ParticipationListItem[]> {
    let query = this.db
      .from('participations')
      .select('id, completed_at, survey:surveys(title), reward:rewards(amount, status)')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (from) {
      query = query.gte('completed_at', from);
    }
    if (to) {
      query = query.lte('completed_at', to);
    }

    const { data, error } = await query;
    if (error) {
      throw new InternalServerErrorException('참여 내역을 불러오지 못했습니다.');
    }
    // supabase는 조인을 배열로 줄 수 있어 단일 객체로 정규화
    return (data ?? []).map((row) => {
      const r = row as Record<string, unknown>;
      const survey = Array.isArray(r.survey) ? r.survey[0] : r.survey;
      const reward = Array.isArray(r.reward) ? r.reward[0] : r.reward;
      return {
        id: r.id as string,
        completed_at: r.completed_at as string,
        survey: (survey as { title: string }) ?? null,
        reward: (reward as { amount: number; status: string }) ?? null,
      };
    });
  }

  /** 누적 참여 횟수 + 리워드 합계. */
  async getTotals(userId: string): Promise<{ count: number; amount: number }> {
    const { data, error } = await this.db.from('rewards').select('amount').eq('user_id', userId);
    if (error) {
      throw new InternalServerErrorException('집계를 불러오지 못했습니다.');
    }
    const rows = data ?? [];
    const amount = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0);
    return { count: rows.length, amount };
  }

  /** 완료 날짜(완료 시각) 전체. streak 계산용. 완료된 참여만. */
  async getCompletedDates(userId: string): Promise<string[]> {
    const { data, error } = await this.db
      .from('participations')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });
    if (error) {
      throw new InternalServerErrorException('집계를 불러오지 못했습니다.');
    }
    return (data ?? []).map((r) => r.completed_at as string);
  }
}
