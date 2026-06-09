import { useMutation } from '@tanstack/react-query';
import {
  type OnboardingRequest,
  type OnboardingResponse,
  postOnboarding,
} from '@/app/onboarding/_apis';

const useOnboardingMutation = () => {
  return useMutation<OnboardingResponse, Error, OnboardingRequest>({
    mutationFn: postOnboarding,
  });
};

export default useOnboardingMutation;
