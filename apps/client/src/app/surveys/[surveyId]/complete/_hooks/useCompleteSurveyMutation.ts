import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HOME_QUERY_KEY } from '@/app/home/_hooks/useHomeQuery';
import { completeSurvey } from '@/app/surveys/[surveyId]/complete/_apis/surveys';
import type { CompleteSurveyResponse } from '@/app/surveys/[surveyId]/complete/_types/types';
import type { ApiError } from '@/lib/api';

const useCompleteSurveyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CompleteSurveyResponse, ApiError, string>({
    mutationFn: completeSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY });
    },
  });
};

export default useCompleteSurveyMutation;
