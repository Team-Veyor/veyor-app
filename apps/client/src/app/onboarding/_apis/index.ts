import type { OnboardingRequest, OnboardingResponse } from '@/app/onboarding/_types/types';
import { ApiError, apiFetch } from '@/lib/api';

export type { OnboardingRequest, OnboardingResponse } from '@/app/onboarding/_types/types';

export const postOnboarding = async (body: OnboardingRequest) => {
  try {
    return await apiFetch<OnboardingResponse>('/users/onboarding', {
      method: 'post',
      json: body,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { onboarded: true };
    }

    throw error;
  }
};
