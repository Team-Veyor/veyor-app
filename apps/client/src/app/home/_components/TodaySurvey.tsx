'use client';

import RewardBadge from '@/app/home/_components/RewardBadge';
import type { RewardStatus } from '@/app/home/types/types';
import CashIcon from '@/assets/icons/CashIcon';
import Button from '@/components/Button/Button';

interface TodaySurveyProps {
  title: string;
  rewardAmount: number;
  estMinutes: string;
  url: string;
  participated: boolean;
  rewardStatus: RewardStatus;
}

const TodaySurvey = ({
  title,
  rewardAmount,
  estMinutes,
  url,
  participated,
  rewardStatus,
}: TodaySurveyProps) => {
  const handleButtonClick = () => {
    if (participated) return;

    window.open(url, '_blank', 'noopener,noreferrer');
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
        <Button size='small' onClick={handleButtonClick} disabled={participated}>
          시작하기
        </Button>
      )}
    </section>
  );
};

export default TodaySurvey;
