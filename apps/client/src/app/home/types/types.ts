export type TodaySurveySummary = {
  id: string;
  title: string;
  estMinutes: string | null;
  rewardAmount: number;
  externalUrl: string;
  expiresAt: string | null;
  participated: boolean;
  rewardStatus: RewardStatus;
};

export type WeeklyStreak = {
  count: number;
  weeklyStatus: string[];
};

export type HomeResponse = {
  accountRegistered: boolean;
  todaySurvey: TodaySurveySummary | null;
  streak: WeeklyStreak;
  totalRewardCount: number;
  totalRewardAmount: number;
};

export type RewardStatus = 'pending' | 'paid';
