import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { ParticipationsService } from '../participations/participations.service';
import { type SurveyRow, SurveysRepository } from './surveys.repository';

export interface TodaySurvey {
  id: string;
  title: string;
  estMinutes: string | null;
  rewardAmount: number;
  externalUrl: string;
  expiresAt: string | null;
  participated: boolean;
}

@Injectable()
export class SurveysService {
  constructor(
    private readonly repo: SurveysRepository,
    private readonly participations: ParticipationsService,
  ) {}

  private matchesTarget(
    survey: SurveyRow,
    profile: { birth_year: number | null; gender: string | null },
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
    const participated = await this.participations.hasParticipated(userId, survey.id);
    return {
      id: survey.id,
      title: survey.title,
      estMinutes: survey.est_minutes,
      rewardAmount: survey.reward_amount,
      externalUrl: survey.external_url,
      expiresAt: survey.expires_at,
      participated,
    };
  }

  /** 설문 완료 인증: 참여 이력 + 리워드 생성. */
  async complete(userId: string, surveyId: string, now: Date = new Date()) {
    const survey = await this.repo.findById(surveyId);
    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }
    if (survey.expires_at && new Date(survey.expires_at).getTime() < now.getTime()) {
      throw new GoneException('참여 기간이 지난 설문입니다.');
    }
    // 중복 참여는 participations 레이어의 unique 제약에서 409로 처리
    return this.participations.complete(userId, surveyId, survey.reward_amount);
  }
}
