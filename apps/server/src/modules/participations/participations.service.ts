import { Injectable } from '@nestjs/common';
import { ParticipationsRepository } from './participations.repository';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

/** ISO 시각 → KST 기준 'YYYY-MM-DD' */
function toKstDate(iso: string): string {
  return new Date(new Date(iso).getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

function kstTodayDate(now: Date): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

function shiftDate(date: string, deltaDays: number): string {
  const d = new Date(`${date}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export interface ParticipationItem {
  id: string;
  surveyTitle: string | null;
  completedAt: string;
  rewardAmount: number | null;
  rewardStatus: string | null;
}

@Injectable()
export class ParticipationsService {
  constructor(private readonly repo: ParticipationsRepository) {}

  /** 설문 완료 처리: 참여 이력 + 리워드(pending) 생성. */
  /** 참여 시작: 'started' 선기록(멱등). 이미 기록 있으면 기존 상태 반환. */
  async start(userId: string, surveyId: string) {
    const { participationId, status } = await this.repo.start(userId, surveyId);
    return { participationId, surveyId, status };
  }

  /** 완료 인증: start 기록을 'completed'로 전이 + 리워드(pending) 생성. */
  async complete(userId: string, surveyId: string, rewardAmount: number) {
    const { participationId } = await this.repo.completeFromStarted(userId, surveyId, rewardAmount);
    return {
      participationId,
      surveyId,
      status: 'completed' as const,
      reward: { amount: rewardAmount, status: 'pending' as const },
    };
  }

  /** 완료 여부(홈의 '참여함' 표시용). started만 한 상태는 false. */
  async hasParticipated(userId: string, surveyId: string): Promise<boolean> {
    return this.repo.hasCompleted(userId, surveyId);
  }

  /** 특정 설문 참여 여부 + 리워드 지급 상태. */
  async getParticipationStatus(userId: string, surveyId: string) {
    return this.repo.getParticipationStatus(userId, surveyId);
  }

  async list(userId: string, from?: string, to?: string) {
    const rows = await this.repo.listByUser(userId, from, to);
    const items: ParticipationItem[] = rows.map((r) => ({
      id: r.id,
      surveyTitle: r.survey?.title ?? null,
      completedAt: r.completed_at,
      rewardAmount: r.reward?.amount ?? null,
      rewardStatus: r.reward?.status ?? null,
    }));
    const totalAmount = items.reduce((sum, i) => sum + (i.rewardAmount ?? 0), 0);
    return { totalCount: items.length, totalAmount, items };
  }

  async getTotals(userId: string) {
    return this.repo.getTotals(userId);
  }

  /** 연속 참여 일수 + 이번 주 참여 요일. KST 기준. */
  async getStreak(userId: string, now: Date = new Date()) {
    const dates = new Set((await this.repo.getCompletedDates(userId)).map(toKstDate));
    const today = kstTodayDate(now);

    // 오늘 참여했으면 오늘부터, 아니면 어제부터 연속 카운트(오늘은 아직 기회 있음)
    let cursor = dates.has(today) ? today : shiftDate(today, -1);
    let count = 0;
    while (dates.has(cursor)) {
      count += 1;
      cursor = shiftDate(cursor, -1);
    }

    // 이번 주(일~토) 참여 요일
    const todayDow = new Date(`${today}T00:00:00.000Z`).getUTCDay();
    const weekStart = shiftDate(today, -todayDow);
    const weeklyStatus: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      const d = shiftDate(weekStart, i);
      if (dates.has(d)) {
        weeklyStatus.push(WEEKDAYS[new Date(`${d}T00:00:00.000Z`).getUTCDay()]);
      }
    }

    return { count, weeklyStatus };
  }
}
