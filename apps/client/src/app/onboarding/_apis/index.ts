import type { OnboardingRequest, OnboardingResponse } from '@/app/onboarding/_types/types';
import { apiFetch } from '@/lib/api';

export type { OnboardingRequest, OnboardingResponse } from '@/app/onboarding/_types/types';

export const postOnboarding = (body: OnboardingRequest) =>
  apiFetch<OnboardingResponse>('/users/onboarding', {
    method: 'post',
    json: body,
  });
