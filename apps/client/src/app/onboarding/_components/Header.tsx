'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon';

const Header = () => {
  const router = useRouter();

  return (
    <header className='flex items-center justify-between h-[44px]'>
      <button
        type='button'
        className='py-2.5 pl-[6px] pr-[14px] cursor-pointer'
        onClick={() => router.back()}
      >
        <ChevronLeftIcon />
      </button>
    </header>
  );
};

export default Header;
