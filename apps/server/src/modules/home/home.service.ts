import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { ParticipationsService } from '../participations/participations.service';
import { SurveysService } from '../surveys/surveys.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly accounts: AccountsService,
    private readonly surveys: SurveysService,
    private readonly participations: ParticipationsService,
  ) {}

  /** 홈 화면 집계(계좌 등록 여부·오늘 설문·연속 참여·누적). */
  async getHome(userId: string) {
    const [accountRegistered, today, streak, totals] = await Promise.all([
      this.accounts.hasAny(userId),
      this.surveys.getToday(userId),
      this.participations.getStreak(userId),
      this.participations.getTotals(userId),
    ]);

    return {
      accountRegistered,
      todaySurvey: today
        ? {
            id: today.id,
            title: today.title,
            estMinutes: today.estMinutes,
            rewardAmount: today.rewardAmount,
            externalUrl: today.externalUrl,
            participated: today.participated,
          }
        : null,
      streak,
      totalRewardCount: totals.count,
      totalRewardAmount: totals.amount,
    };
  }
}
