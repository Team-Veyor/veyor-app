import TodaySurvey from '@/app/home/_components/TodaySurvey';
import WeeklyStreakCard from '@/app/home/_components/WeeklyStreakCard';
import CalendarIcon from '@/assets/icons/CalendarIcon';
import Callout from '@/components/Callout/Callout';

const HomePage = () => {
  return (
    <div className='flex flex-col gap-12'>
      <Callout
        type='success'
        icon={<CalendarIcon className='size-16' />}
        title='설문 게시 시간: 매일 오전 10시'
      />
      <TodaySurvey
        title='데일리 보부상 가방 디자인 설문조사'
        rewardAmount={1000}
        estMinutes={'2~3'}
        url='https://www.google.com'
        participated={false}
      />
      <WeeklyStreakCard streak={3} weeklyStatus={['mon', 'tue', 'wed']} totalRewardAmount={1000} />
    </div>
  );
};

export default HomePage;
