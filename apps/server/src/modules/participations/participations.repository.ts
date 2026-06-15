import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
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

  /** 참여 + 리워드(pending) 생성. 설문당 1회(unique) 위반 시 ConflictException. */
  async createWithReward(
    userId: string,
    surveyId: string,
    rewardAmount: number,
  ): Promise<{ participationId: string }> {
    const { data: participation, error } = await this.db
      .from('participations')
      .insert({ user_id: userId, survey_id: surveyId })
      .select('id')
      .single();

    if (error) {
      // 23505 = unique_violation (설문당 1회)
      if (error.code === '23505') {
        throw new ConflictException('이미 참여한 설문입니다.');
      }
      throw new InternalServerErrorException('인증할 수 없습니다. 다시 시도해주세요.');
    }

    const { error: rewardError } = await this.db.from('rewards').insert({
      participation_id: participation.id,
      user_id: userId,
      amount: rewardAmount,
      status: 'pending',
    });
    if (rewardError) {
      // 보상 생성 실패 시 참여도 롤백(보상 없는 참여 방지)
      await this.db.from('participations').delete().eq('id', participation.id);
      throw new InternalServerErrorException('인증할 수 없습니다. 다시 시도해주세요.');
    }

    return { participationId: participation.id };
  }

  async exists(userId: string, surveyId: string): Promise<boolean> {
    const { data } = await this.db
      .from('participations')
      .select('id')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .maybeSingle();
    return !!data;
  }

  /** 특정 설문 참여 여부 + 리워드 지급 상태. 미참여면 status는 null. */
  async getParticipationStatus(
    userId: string,
    surveyId: string,
  ): Promise<{ participated: boolean; rewardStatus: string | null }> {
    const { data } = await this.db
      .from('participations')
      .select('id, reward:rewards(status)')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .maybeSingle();

    if (!data) {
      return { participated: false, rewardStatus: null };
    }
    const row = data as Record<string, unknown>;
    const reward = Array.isArray(row.reward) ? row.reward[0] : row.reward;
    return {
      participated: true,
      rewardStatus: (reward as { status: string } | null)?.status ?? null,
    };
  }

  /** 기간 내 참여 목록(설문 제목·리워드 포함). from/to는 ISO 문자열. */
  async listByUser(userId: string, from?: string, to?: string): Promise<ParticipationListItem[]> {
    let query = this.db
      .from('participations')
      .select('id, completed_at, survey:surveys(title), reward:rewards(amount, status)')
      .eq('user_id', userId)
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

  /** 완료 날짜(완료 시각) 전체. streak 계산용. */
  async getCompletedDates(userId: string): Promise<string[]> {
    const { data, error } = await this.db
      .from('participations')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    if (error) {
      throw new InternalServerErrorException('집계를 불러오지 못했습니다.');
    }
    return (data ?? []).map((r) => r.completed_at as string);
  }
}
