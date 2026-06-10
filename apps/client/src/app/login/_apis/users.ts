import { apiFetch } from '@/lib/api';

export type MeResponse = {
  id: string;
  name: string;
  email: string;
  birthYear: number | null;
  gender: 'male' | 'female' | null;
  onboarded: boolean;
  totalRewardCount: number;
  totalRewardAmount: number;
};

export const getUser = () => apiFetch<MeResponse>('/users/me');
