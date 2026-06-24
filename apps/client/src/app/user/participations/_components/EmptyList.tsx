'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';

const EmptyList = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col px-16 py-[56px] items-center justify-center gap-20 bg-white'>
      <div className='flex flex-col items-center label-medium text-gray-500 gap-2'>
        <p className='body-medium text-text-secondary'>참여한 설문이 없어요</p>
        <p className='body-small text-text-tertiary'>홈으로 돌아가 오늘 설문부터 참여해보세요</p>
      </div>
      <Button
        variant='secondary'
        theme='light'
        size='small'
        onClick={() => router.push('/home')}
        className='w-fit px-12 py-16'
      >
        홈으로 이동
      </Button>
    </div>
  );
};

export default EmptyList;
