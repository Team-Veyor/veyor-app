import { apiFetch } from '@/lib/api';

/**
 * 설문 시작 기록. 외부 설문을 열기 전에 호출한다.
 * 이 기록이 없으면 이후 완료 인증(POST /surveys/:id/complete)이 거부된다.
 */
export const startSurvey = (surveyId: string) =>
  apiFetch<void>(`/surveys/${surveyId}/start`, {
    method: 'post',
  });
