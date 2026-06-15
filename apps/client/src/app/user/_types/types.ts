export type Gender = 'male' | 'female';

export type Me = {
  id: string;
  name: string;
  email: string;
  birthYear: number | null;
  gender: Gender | null;
  onboarded: boolean;
  totalRewardCount: number;
  totalRewardAmount: number;
};
