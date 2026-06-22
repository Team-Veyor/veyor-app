import { useMutation } from '@tanstack/react-query';
import { startSurvey } from '@/app/home/_apis/startSurvey';

const useStartSurveyMutation = () =>
  useMutation<void, Error, string>({
    mutationFn: startSurvey,
  });

export default useStartSurveyMutation;
