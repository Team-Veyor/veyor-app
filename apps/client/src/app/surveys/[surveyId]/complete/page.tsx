'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import SurveyCompleteBottomSheet from '@/app/surveys/[surveyId]/complete/_components/SurveyCompleteBottomSheet';
import useCompleteSurveyMutation from '@/app/surveys/[surveyId]/complete/_hooks/useCompleteSurveyMutation';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useToast } from '@/components/Toast/ToastProvider';
import { ApiError } from '@/lib/api';

const CHAT_SUPPORT_URL = '#';
const HOME_REDIRECT_DELAY_MS = 1800;

const COMPLETE_ERROR_TOAST_MESSAGES: Record<number, string> = {
  409: '이미 참여한 설문입니다.',
  410: '참여 기간이 지난 설문입니다.',
};

const SurveyCompletePage = () => {
  const router = useRouter();
  const { surveyId } = useParams<{ surveyId: string }>();
  const hasRequestedRef = useRef(false);
  const completeSurveyMutation = useCompleteSurveyMutation();
  const { showToast } = useToast();

  const completeError = completeSurveyMutation.error;
  const completeErrorToastMessage =
    completeError instanceof ApiError ? COMPLETE_ERROR_TOAST_MESSAGES[completeError.status] : undefined;

  useEffect(() => {
    if (!surveyId || hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    completeSurveyMutation.mutate(surveyId);
  }, [completeSurveyMutation, surveyId]);

  useEffect(() => {
    if (!completeErrorToastMessage) return;

    showToast({ type: 'warning', message: completeErrorToastMessage });

    const redirectTimer = window.setTimeout(() => {
      router.replace('/home');
    }, HOME_REDIRECT_DELAY_MS);

    return () => window.clearTimeout(redirectTimer);
  }, [completeErrorToastMessage, router, showToast]);

  const handleHomeClick = () => {
    router.replace('/home');
  };

  const handleContactClick = () => {
    window.open(CHAT_SUPPORT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className='min-h-dvh bg-gray-100'>
      {completeSurveyMutation.isPending && (
        <div className='flex min-h-dvh items-center justify-center px-20'>
          <p className='label-medium text-gray-500'>설문 완료를 인증하고 있어요.</p>
        </div>
      )}

      {completeSurveyMutation.isSuccess && <SurveyCompleteBottomSheet onHomeClick={handleHomeClick} />}

      {completeSurveyMutation.isError && !completeErrorToastMessage && (
        <ConfirmModal
          title='인증할 수 없습니다.'
          description={'운영진에게 문의 상황을 알려주시면\n빠르게 조치 도와드리겠습니다.'}
          leftButtonText='취소'
          rightButtonText='문의하기'
          onLeftButtonClick={handleHomeClick}
          onRightButtonClick={handleContactClick}
        />
      )}
    </main>
  );
};

export default SurveyCompletePage;
