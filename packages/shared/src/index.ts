export type HealthResponse = {
  status: 'ok';
  timestamp: string;
};

/**
 * 설문 완료 인증(complete) 실패 사유 코드.
 * 서버가 에러 응답 body의 `code`로 내려주고, 클라가 이 코드로 사용자 안내를 분기한다.
 * - survey_expired: 기간이 끝난 설문 링크 접속
 * - tracking_param_lost: '참여하기'(start) 기록 없이 인증 링크 직접 접속 (구체 사유는 사용자에게 숨김)
 * - already_participated: 이미 참여(완료)한 설문 재인증 (중복)
 * - target_response_count: 모집 인원(정원) 마감
 */
export type SurveyCompleteFailureReason =
  | 'survey_expired'
  | 'tracking_param_lost'
  | 'already_participated'
  | 'target_response_count';
