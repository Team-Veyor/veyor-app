'use client';

import type { SurveyCompleteFailureReason } from '@veyor/shared';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import SurveyCompleteBottomSheet from '@/app/surveys/[surveyId]/complete/_components/SurveyCompleteBottomSheet';
import SurveyCompleteSkeleton from '@/app/surveys/[surveyId]/complete/_components/SurveyCompleteSkeleton';
import useCompleteSurveyMutation from '@/app/surveys/[surveyId]/complete/_hooks/useCompleteSurveyMutation';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useToast } from '@/components/Toast/ToastProvider';
import {
  AMPLITUDE_SHARE_CHANNELS,
  getAmplitudeCompletionErrorReason,
  normalizeAmplitudeCompletionTime,
  trackAmplitudeEvent,
  updateAmplitudeUserProperties,
} from '@/lib/amplitude';
import { ApiError } from '@/lib/api';

const CHAT_SUPPORT_URL = '#';
const HOME_REDIRECT_DELAY_MS = 1800;

// 인증 실패 사유 코드별 사용자 안내.
// complete_unavailable('참여하기' 미클릭 후 직접 접속)는 구체 사유를 숨기고 일반 문구만 노출한다.
const COMPLETE_ERROR_MESSAGES: Record<SurveyCompleteFailureReason, string> = {
  survey_expired: '참여 기간이 지난 설문입니다.',
  already_participated: '이미 참여한 설문입니다.',
  target_response_count: '모집이 마감된 설문입니다.',
  complete_unavailable: '인증을 진행할 수 없습니다.',
};

const SurveyCompletePage = () => {
  const router = useRouter();

  const { surveyId } = useParams<{ surveyId: string }>();
  const hasRequestedRef = useRef(false);
  const completionStartedAtRef = useRef<number | null>(null);

  const completeSurveyMutation = useCompleteSurveyMutation();
  const { showToast } = useToast();

  const completeError = completeSurveyMutation.error;
  // 상태코드가 아닌 서버 사유 코드(code)로 분기한다. 알 수 없는 코드/코드 없음은 fallback 모달로 흐른다.
  const completeErrorToastMessage =
    completeError instanceof ApiError && completeError.code
      ? COMPLETE_ERROR_MESSAGES[completeError.code as SurveyCompleteFailureReason]
      : undefined;

  useEffect(() => {
    if (!surveyId || hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    completionStartedAtRef.current = Date.now();
    completeSurveyMutation.mutate(surveyId, {
      onSuccess: () => {
        const completedAt = new Date().toISOString();

        updateAmplitudeUserProperties((identify) => {
          identify.set('user_type', 'respondent');
          identify.setOnce('first_survey_completed_at', completedAt);
          identify.add('total_survey_completed_count', 1);
          identify.set('last_survey_completed_at', completedAt);
        });

        trackAmplitudeEvent('survey_completed', {
          entry_point: '/complete-survey',
          survey_id: surveyId,
          completion_time: normalizeAmplitudeCompletionTime(completionStartedAtRef.current),
        });
      },
      onError: (error) => {
        trackAmplitudeEvent('survey_complete_failed', {
          entry_point: '/complete-survey',
          survey_id: surveyId,
          completion_time: normalizeAmplitudeCompletionTime(completionStartedAtRef.current),
          error_reason: getAmplitudeCompletionErrorReason(error),
        });
      },
    });
  }, [completeSurveyMutation, surveyId]);

  useEffect(() => {
    if (!completeErrorToastMessage) return;

    showToast({ type: 'danger', message: completeErrorToastMessage });

    const redirectTimer = window.setTimeout(() => {
      router.replace('/home');
    }, HOME_REDIRECT_DELAY_MS);

    return () => window.clearTimeout(redirectTimer);
  }, [completeErrorToastMessage, router, showToast]);

  const handleHomeClick = () => {
    trackAmplitudeEvent('cancel_clicked', { survey_id: surveyId });
    router.replace('/home');
  };

  const handleContactClick = () => {
    trackAmplitudeEvent('chat_support_clicked', {
      entry_point: '/complete-survey',
      survey_id: surveyId,
      share_channel: AMPLITUDE_SHARE_CHANNELS.kakao_open_chat,
    });
    window.open(CHAT_SUPPORT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='min-h-dvh bg-gray-100'>
      {completeSurveyMutation.isPending && <SurveyCompleteSkeleton />}

      {completeSurveyMutation.isSuccess && <SurveyCompleteBottomSheet />}

      {completeSurveyMutation.isError && (
        <ConfirmModal
          title='인증할 수 없습니다.'
          description={'운영진에게 문의 상황을 알려주시면\n빠르게 조치 도와드리겠습니다.'}
          leftButtonText='취소'
          rightButtonText='문의하기'
          onLeftButtonClick={handleHomeClick}
          onRightButtonClick={handleContactClick}
        />
      )}
    </div>
  );
};

export default SurveyCompletePage;
