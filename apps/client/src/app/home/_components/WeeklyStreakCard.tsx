import { WEEKDAYS } from '@/app/home/_constants/constants';
import CashIcon from '@/assets/icons/CashIcon';
import CheckIcon from '@/assets/icons/CheckIcon';
import Button from '@/components/Button/Button';
import { cn } from '@/lib/utils';

interface WeeklyStreakCardProps {
  streak: number;
  weeklyStatus: string[];
  totalRewardAmount: number;
}

const WeeklyStreakCard = ({ streak, weeklyStatus, totalRewardAmount }: WeeklyStreakCardProps) => {
  return (
    <section className='flex flex-col gap-16 pt-20 px-20 pb-12 rounded-20 bg-white'>
      <header className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <h2 className='title-medium text-gray-500'>연속</h2>
          <h2 className='title-medium text-gray-900'>{streak}일째</h2>
        </div>
        <p className='subtext-medium text-gray-600'>매일 매일 차곡차곡 모아봐요</p>
      </header>

      <WeeklyStreak status={weeklyStatus} />
      <div className='border-t border-black-alpha-5' />
      <SavedMoney money={totalRewardAmount} />

      <Button variant='secondary' theme='light' size='small'>
        참여 내역 보기
      </Button>
    </section>
  );
};

export default WeeklyStreakCard;

const WeeklyStreak = ({ status }: { status: string[] }) => {
  const checkedSet = new Set(status);

  return (
    <div className='flex w-full flex-col gap-8'>
      <div className='grid w-full grid-cols-7'>
        {WEEKDAYS.map(({ key, label }) => (
          <div key={key} className='flex justify-center label-xsmall text-gray-500'>
            {label}
          </div>
        ))}
      </div>

      <div className='grid w-full grid-cols-7 items-center'>
        {WEEKDAYS.map(({ key }, index) => {
          const isLast = index === WEEKDAYS.length - 1;
          const checked = checkedSet.has(key);
          const nextChecked = !isLast && checkedSet.has(WEEKDAYS[index + 1].key);

          return (
            <div key={key} className='relative flex items-center justify-center'>
              <StreakCell checked={checked} />
              {!isLast && <StreakConnector active={nextChecked} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StreakConnector = ({ active }: { active: boolean }) => (
  <span
    aria-hidden='true'
    className={cn(
      'absolute left-full top-1/2 h-px w-8 rounded-full -translate-x-1/2 -translate-y-1/2',
      active ? 'bg-brand-alpha-50' : 'bg-black-alpha-10',
    )}
  />
);

const StreakCell = ({ checked }: { checked: boolean }) => {
  if (checked) {
    return (
      <span
        role='img'
        aria-label='출석 완료'
        className={cn(
          'inline-flex size-28 items-center justify-center rounded-full',
          'bg-brand-alpha-15 text-brand-500',
          'shadow-[inset_0_0_5px_0_rgba(0,201,90,0.10)]',
        )}
      >
        <CheckIcon className='size-28' />
      </span>
    );
  }

  return (
    <span
      role='img'
      aria-label='미출석'
      className={cn(
        'inline-block size-28 rounded-full',
        'border border-brand-alpha-10 bg-brand-alpha-5',
        'shadow-[inset_0_0_5px_0_rgba(73,122,244,0.10)]',
      )}
    />
  );
};

const SavedMoney = ({ money }: { money: number }) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-8'>
        <CashIcon />
        <p className='label-medium text-gray-500'>내가 모은 돈</p>
      </div>
      <p className='label-medium text-gray-600'>{money.toLocaleString()}원</p>
    </div>
  );
};
