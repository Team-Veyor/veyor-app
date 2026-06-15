'use client';

import AccountRegisterCard from '@/app/home/_components/AccountRegisterCard';
import TodaySurvey from '@/app/home/_components/TodaySurvey';
import WeeklyStreakCard from '@/app/home/_components/WeeklyStreakCard';
import useHomeQuery from '@/app/home/_hooks/useHomeQuery';
import CalendarIcon from '@/assets/icons/CalendarIcon';
import Callout from '@/components/Callout/Callout';

const HomePage = () => {
  const { data, isPending, isLoading, isError } = useHomeQuery();

  if (isPending || isLoading) {
    // TODO: 로딩 스피너 추가
    return <p className='label-medium text-gray-500'>불러오는 중...</p>;
  }

  if (isError || !data) {
    // TODO: 에러 처리
    return <p className='label-medium text-gray-500'>홈 정보를 불러오지 못했어요.</p>;
  }

  const { accountRegistered, todaySurvey, streak, totalRewardAmount } = data;

  if (!accountRegistered) {
    return <AccountRegisterCard />;
  }

  if (!todaySurvey) {
    // TODO: 오늘 설문 없을 때 처리
    return <p className='label-medium text-gray-500'>오늘 설문이 없어요.</p>;
  }

  return (
    <div className='flex flex-col gap-12'>
      <Callout
        type='success'
        icon={<CalendarIcon className='size-16' />}
        title='설문 게시 시간: 매일 오전 10시'
      />

      <TodaySurvey
        title={todaySurvey.title}
        rewardAmount={todaySurvey.rewardAmount}
        estMinutes={todaySurvey.estMinutes}
        url={todaySurvey.externalUrl}
        participated={todaySurvey.participated}
        rewardStatus={todaySurvey.rewardStatus}
      />

      <WeeklyStreakCard
        streak={streak.count}
        weeklyStatus={streak.weeklyStatus}
        totalRewardAmount={totalRewardAmount}
      />
    </div>
  );
};

export default HomePage;
