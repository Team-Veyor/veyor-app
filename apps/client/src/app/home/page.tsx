'use client';

import AccountRegisterCard from '@/app/home/_components/AccountRegisterCard';
import HomeSkeleton from '@/app/home/_components/HomeSkeleton';
import TodaySurvey from '@/app/home/_components/TodaySurvey';
import WeeklyStreakCard from '@/app/home/_components/WeeklyStreakCard';
import useHomeQuery from '@/app/home/_hooks/useHomeQuery';
import CalendarIcon from '@/assets/icons/CalendarIcon';
import Callout from '@/components/Callout/Callout';

const HomePage = () => {
  const { data, isPending, isLoading, isError } = useHomeQuery();

  if (isPending || isLoading) {
    return <HomeSkeleton />;
  }

  if (isError || !data) {
    return <p className='label-medium text-gray-500'>홈 정보를 불러오지 못했어요.</p>;
  }

  if (!data?.accountRegistered) {
    return <AccountRegisterCard />;
  }

  if (!data?.todaySurvey) {
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
        id={data.todaySurvey.id}
        title={data.todaySurvey.title}
        rewardAmount={data.todaySurvey.rewardAmount}
        estMinutes={data.todaySurvey.estMinutes}
        url={data.todaySurvey.externalUrl}
        participated={data.todaySurvey.participated}
        accountRegistered={data.accountRegistered}
        rewardStatus={data.todaySurvey.rewardStatus}
      />

      <WeeklyStreakCard
        streak={data.streak.count}
        weeklyStatus={data.streak.weeklyStatus}
        totalRewardAmount={data.totalRewardAmount}
      />
    </div>
  );
};

export default HomePage;
