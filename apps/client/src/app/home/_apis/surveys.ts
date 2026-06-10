import type { CompleteSurveyResponse } from '@/app/home/types/types';
import { apiFetch } from '@/lib/api';

export const completeSurvey = (surveyId: string) =>
  apiFetch<CompleteSurveyResponse>(`/surveys/${surveyId}/complete`, {
    method: 'post',
  });
