import { apiFetch } from '@/lib/api';

export type MeResponse = {
  onboarded: boolean;
};

export const getUser = () => apiFetch<MeResponse>('/users/me');
