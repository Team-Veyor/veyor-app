import CalendarIcon from '@/assets/icons/CalendarIcon';
import Callout from '@/components/Callout/Callout';

const HomePage = () => {
  return (
    <div>
      <Callout
        type='success'
        icon={<CalendarIcon className='size-4' />}
        title='설문 게시 시간: 매일 오전 10시'
      />
    </div>
  );
};

export default HomePage;
