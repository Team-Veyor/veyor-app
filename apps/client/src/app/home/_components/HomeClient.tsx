'use client';

import AccountRegisterCard from '@/app/home/_components/AccountRegisterCard';
import HomeSkeleton from '@/app/home/_components/HomeSkeleton';
import TodaySurvey from '@/app/home/_components/TodaySurvey';
import WeeklyStreakCard from '@/app/home/_components/WeeklyStreakCard';
import useHomeQuery from '@/app/home/_hooks/useHomeQuery';
import CalendarIcon from '@/assets/icons/CalendarIcon';
import KakaoIcon from '@/assets/icons/KakaoIcon';
import Button from '@/components/Button/Button';
import Callout from '@/components/Callout/Callout';

const _CHAT_SUPPORT_URL = 'https://open.kakao.com/o/gpHKdMsi';

const OpenChatFloatingButton = () => {
  return (
    <Button
      onClick={() => window.open(_CHAT_SUPPORT_URL, '_blank')}
      className='fixed right-[max(16px,calc((100vw-640px)/2+16px))] bottom-[112px] z-10 flex w-fit flex-col items-center justify-center gap-[6px] rounded-24 bg-[#FEE500] px-12 py-12 text-center text-black shadow-[0_4px_10px_0_rgba(0,0,0,0.20),inset_0_0_12px_0_rgba(255,255,255,0.80)] after:hidden'
    >
      <KakaoIcon className='size-24' />
      <span className='text-[10px] font-normal weight-600 leading-[135%]'>오픈채팅방</span>
    </Button>
  );
};

const HomeClient = () => {
  const { data, isPending, isLoading, isError } = useHomeQuery();
  const todaySurveys = data?.todaySurveys ?? (data?.todaySurvey ? [data.todaySurvey] : []);

  if (isPending || isLoading) {
    return (
      <>
        <HomeSkeleton />
        <OpenChatFloatingButton />
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <p className='label-medium text-gray-500'>홈 정보를 불러오지 못했어요.</p>
        <OpenChatFloatingButton />
      </>
    );
  }

  if (!data?.accountRegistered) {
    return (
      <>
        <AccountRegisterCard />
        <OpenChatFloatingButton />
      </>
    );
  }

  if (todaySurveys.length === 0) {
    return (
      <>
        <p className='label-medium text-gray-500'>오늘 설문이 없어요.</p>
        <OpenChatFloatingButton />
      </>
    );
  }

  return (
    <>
      <div className='flex flex-col gap-12'>
        <Callout
          type='success'
          icon={<CalendarIcon className='size-16' />}
          title='설문 게시 시간: 매일 오전 10시'
        />

        {todaySurveys.map((survey) => (
          <TodaySurvey
            key={survey.id}
            id={survey.id}
            title={survey.title}
            rewardAmount={survey.rewardAmount}
            estMinutes={survey.estMinutes}
            url={survey.externalUrl}
            expiresAt={survey.expiresAt}
            participated={survey.participated}
            accountRegistered={data.accountRegistered}
            rewardStatus={survey.rewardStatus}
          />
        ))}

        <WeeklyStreakCard
          streak={data.streak.count}
          weeklyStatus={data.streak.weeklyStatus}
          totalRewardAmount={data.totalRewardAmount}
        />
      </div>
      <OpenChatFloatingButton />
    </>
  );
};

export default HomeClient;
