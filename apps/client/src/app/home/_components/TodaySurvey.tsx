'use client';

import { useRouter } from 'next/navigation';
import RewardBadge from '@/app/home/_components/RewardBadge';
import useStartSurveyMutation from '@/app/home/_hooks/useStartSurveyMutation';
import type { RewardStatus } from '@/app/home/types/types';
import CashIcon from '@/assets/icons/CashIcon';
import Button from '@/components/Button/Button';
import { useToast } from '@/components/Toast/ToastProvider';
import { ApiError } from '@/lib/api';

interface TodaySurveyProps {
  id: string;
  title: string;
  rewardAmount: number;
  estMinutes: string;
  url: string;
  participated: boolean;
  accountRegistered: boolean;
  rewardStatus: RewardStatus;
}

const TodaySurvey = ({
  id,
  title,
  rewardAmount,
  estMinutes,
  url,
  participated,
  accountRegistered,
  rewardStatus,
}: TodaySurveyProps) => {
  const router = useRouter();
  const { mutate: startSurvey, isPending } = useStartSurveyMutation();
  const { showToast } = useToast();

  const handleButtonClick = () => {
    if (participated || isPending) return;

    // 대표계좌가 없으면 리워드를 받을 수 없으므로, 설문을 열기 전에 계좌 등록으로 유도한다.
    if (!accountRegistered) {
      showToast({ type: 'warning', message: '대표계좌를 먼저 등록해주세요.' });
      router.push('/account/new');
      return;
    }

    // 외부 설문을 열기 전에 시작 기록을 먼저 남긴다.
    // 시작 기록이 없으면 이후 완료 인증(complete)이 거부되므로, 시작 성공 후에만 설문을 연다.
    startSurvey(id, {
      onSuccess: () => {
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      onError: (error) => {
        // 서버 검증(428 Precondition Required): 대표계좌 미등록 → 계좌 등록으로 유도
        if (error instanceof ApiError && error.status === 428) {
          showToast({ type: 'warning', message: '대표계좌를 먼저 등록해주세요.' });
          router.push('/account/new');
          return;
        }
        showToast({
          type: 'warning',
          message: '설문을 시작할 수 없어요. 잠시 후 다시 시도해주세요.',
        });
      },
    });
  };

  return (
    <section className='flex flex-col gap-20 pt-16 px-20 pb-20 rounded-20 bg-white'>
      <div className='flex flex-col gap-[6.5px]'>
        <p className='label-small text-gray-500'>오늘 설문</p>
        <div className='flex flex-col gap-8'>
          <h2 className='label-medium'>{title}</h2>
          <div className='flex items-center gap-4'>
            <CashIcon />
            <p className='label-medium-strong'>{rewardAmount}원</p>
            <p>/</p>
            {participated ? (
              <RewardBadge rewardStatus={rewardStatus} />
            ) : (
              <p className='text-tertiary'>{estMinutes}분</p>
            )}
          </div>
        </div>
      </div>
      {!participated && (
        <Button
          size='small'
          onClick={handleButtonClick}
          disabled={participated}
          isLoading={isPending}
        >
          시작하기
        </Button>
      )}
    </section>
  );
};

export default TodaySurvey;
