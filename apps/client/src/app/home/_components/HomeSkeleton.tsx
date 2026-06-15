import { WEEKDAYS } from '@/app/home/_constants/constants';
import Skeleton from '@/components/Skeleton/Skeleton';

const HomeSkeleton = () => {
  return (
    <div className='flex flex-col gap-12'>
      <div className='flex items-center rounded-12 bg-black-alpha-5 p-3'>
        <Skeleton width={24} height={24} className='rounded-8' />
      </div>

      <section className='flex flex-col gap-20 pt-16 px-20 pb-20 rounded-20 bg-white'>
        <div className='flex flex-col gap-8 pb-12'>
          <Skeleton width={101} height={18} />
          <div className='flex flex-col gap-8'>
            <Skeleton width='70%' height={18} />
            <Skeleton width='100%' height={18} />
          </div>
        </div>
        <Skeleton height={43} className='rounded-12' />
      </section>

      <section className='flex flex-col gap-16 pt-20 px-20 pb-12 rounded-20 bg-white'>
        <div className='flex flex-col gap-4'>
          <Skeleton width='40%' height={20} />
          <Skeleton width='70%' height={14} />
        </div>

        <div className='flex flex-col gap-8'>
          <div className='grid grid-cols-7'>
            {WEEKDAYS.map(({ key }) => (
              <Skeleton
                key={key}
                shape='circle'
                width={16}
                height={16}
                className='justify-self-center'
              />
            ))}
          </div>
          <div className='grid grid-cols-7'>
            {WEEKDAYS.map(({ key }) => (
              <Skeleton
                key={key}
                shape='circle'
                width={28}
                height={28}
                className='justify-self-center'
              />
            ))}
          </div>
        </div>

        <div className='border-t border-black-alpha-5' />

        <div className='flex items-center justify-between'>
          <Skeleton width={96} height={16} />
          <Skeleton width={56} height={16} />
        </div>

        <Skeleton height={40} className='rounded-12' />
      </section>
    </div>
  );
};

export default HomeSkeleton;
