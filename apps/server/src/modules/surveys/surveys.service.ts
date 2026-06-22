import { GoneException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { ParticipationsService } from '../participations/participations.service';
import { type SurveyRow, SurveysRepository } from './surveys.repository';

export type RewardStatus = 'pending' | 'paid';

export interface TodaySurvey {
  id: string;
  title: string;
  estMinutes: string | null;
  rewardAmount: number;
  externalUrl: string;
  expiresAt: string | null;
  participated: boolean;
  rewardStatus: RewardStatus;
}

@Injectable()
export class SurveysService {
  constructor(
    private readonly repo: SurveysRepository,
    private readonly participations: ParticipationsService,
    private readonly accounts: AccountsService,
  ) {}

  private matchesTarget(
    survey: SurveyRow,
    profile: { birth_year: number | null; gender: string | null; occupation: string | null },
  ): boolean {
    if (survey.target_gender && survey.target_gender !== profile.gender) {
      return false;
    }
    if (survey.target_birth_year_min != null) {
      if (profile.birth_year == null || profile.birth_year < survey.target_birth_year_min) {
        return false;
      }
    }
    if (survey.target_birth_year_max != null) {
      if (profile.birth_year == null || profile.birth_year > survey.target_birth_year_max) {
        return false;
      }
    }
    // 직업 타깃: 프로필에 직업이 있을 때만 필터링한다.
    // 아직 직업 미수집(null)인 사용자는 노출을 유지하고, 온보딩에서 직업을
    // 수집하기 시작하면 자연히 정밀 매칭으로 전환된다.
    if (survey.target_occupation && profile.occupation) {
      if (survey.target_occupation !== profile.occupation) {
        return false;
      }
    }
    return true;
  }

  /** 오늘 노출할 설문 1건(타깃 매칭). 없으면 null. */
  async getToday(userId: string, now: Date = new Date()): Promise<TodaySurvey | null> {
    const nowIso = now.toISOString();
    const [candidates, profile] = await Promise.all([
      this.repo.findOpenCandidates(nowIso),
      this.repo.getProfileTarget(userId),
    ]);
    const survey = candidates.find((s) => this.matchesTarget(s, profile));
    if (!survey) {
      return null;
    }
    const { participated, rewardStatus } = await this.participations.getParticipationStatus(
      userId,
      survey.id,
    );
    return {
      id: survey.id,
      title: survey.title,
      estMinutes: survey.est_minutes,
      rewardAmount: survey.reward_amount,
      externalUrl: survey.external_url,
      expiresAt: survey.expires_at,
      participated,
      rewardStatus: rewardStatus === 'paid' ? 'paid' : 'pending',
    };
  }

  /**
   * 설문 참여 시작: "참여" 버튼 → 외부 설문 이동 직전 호출.
   * 노출중(게시·승인·기간 내)인 설문만 시작 가능. 참여 이력을 'started'로 선기록(멱등).
   */
  async start(userId: string, surveyId: string, now: Date = new Date()) {
    const survey = await this.repo.findById(surveyId);
    if (!survey) {
      throw new NotFoundException('참여할 수 없는 설문입니다.');
    }
    if (survey.expires_at && new Date(survey.expires_at).getTime() < now.getTime()) {
      throw new GoneException('참여할 수 없는 설문입니다.');
    }
    const open =
      survey.is_published &&
      survey.approval_status === 'approved' &&
      new Date(survey.opens_at).getTime() <= now.getTime();
    if (!open) {
      throw new NotFoundException('참여할 수 없는 설문입니다.');
    }
    // 대표계좌가 없으면 리워드 지급 대상이 될 수 없으므로 시작 단계에서 차단(428).
    if (!(await this.accounts.hasAny(userId))) {
      throw new HttpException('대표계좌를 먼저 등록해주세요.', 428);
    }
    return this.participations.start(userId, surveyId);
  }

  /** 설문 완료 인증: start 기록이 있어야 처리. 참여 이력 완료 전이 + 리워드 생성. */
  async complete(userId: string, surveyId: string, now: Date = new Date()) {
    const survey = await this.repo.findById(surveyId);
    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }
    if (survey.expires_at && new Date(survey.expires_at).getTime() < now.getTime()) {
      throw new GoneException('참여 기간이 지난 설문입니다.');
    }
    // start 기록 게이트·중복 참여는 participations 레이어에서 처리
    return this.participations.complete(userId, surveyId, survey.reward_amount);
  }
}
