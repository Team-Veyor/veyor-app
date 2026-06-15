import Skeleton from '@/components/Skeleton/Skeleton';

const SurveyCompleteSkeleton = () => {
  return (
    <div className='flex min-h-dvh items-center px-20'>
      <section className='flex w-full flex-col gap-30 rounded-32 bg-white px-20 py-16 shadow-[0_24px_64px_0_rgba(255,255,255,0.72)]'>
        <div className='flex flex-col gap-8'>
          <Skeleton width={101} height={18} className='rounded-max' />
          <Skeleton width='100%' height={18} className='rounded-max' />
          <Skeleton width='70%' height={18} className='rounded-max' />
        </div>
        <Skeleton width='100%' height={43} className='rounded-max' />
      </section>
    </div>
  );
};

export default SurveyCompleteSkeleton;
