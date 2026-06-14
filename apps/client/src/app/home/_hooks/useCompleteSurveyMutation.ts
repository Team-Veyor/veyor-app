import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeSurvey } from '@/app/home/_apis/surveys';
import { HOME_QUERY_KEY } from '@/app/home/_hooks/useHomeQuery';
import type { CompleteSurveyResponse } from '@/app/home/types/types';

const useCompleteSurveyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CompleteSurveyResponse, Error, string>({
    mutationFn: completeSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY });
    },
  });
};

export default useCompleteSurveyMutation;
