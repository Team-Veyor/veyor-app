export type TodaySurveySummary = {
  id: string;
  title: string;
  estMinutes: string;
  rewardAmount: number;
  externalUrl: string;
  participated: boolean;
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

export type CompleteSurveyResponse = {
  participationId: string;
  surveyId: string;
  status: 'completed';
  reward: {
    amount: number;
    status: RewardStatus;
  };
};

export type RewardStatus = 'pending' | 'paid';
