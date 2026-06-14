export type RewardStatus = 'pending' | 'paid';

export type Participation = {
  id: string;
  surveyTitle: string;
  completedAt: string;
  rewardAmount: number;
  rewardStatus: RewardStatus;
};

export type ParticipationsResponse = {
  totalCount: number;
  totalAmount: number;
  items: Participation[];
};
