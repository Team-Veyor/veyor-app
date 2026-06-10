'use client';

import CashIcon from '@/assets/icons/CashIcon';
import Button from '@/components/Button/Button';

interface TodaySurveyProps {
  title: string;
  rewardAmount: number;
  estMinutes: string;
  url: string;
  participated: boolean;
}

const TodaySurvey = ({ title, rewardAmount, estMinutes, url, participated }: TodaySurveyProps) => {
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
            <p className='text-tertiary'>{estMinutes}분</p>
          </div>
        </div>
      </div>
      <Button
        theme='brand'
        size='small'
        onClick={() => {
          window.open(url, '_blank');
        }}
      >
        시작하기
      </Button>
    </section>
  );
};

export default TodaySurvey;
