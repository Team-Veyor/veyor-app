'use client';

import { useRouter } from 'next/navigation';
import type { ComponentPropsWithoutRef } from 'react';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon';
import LogoIcon from '@/assets/icons/LogoIcon';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps extends ComponentPropsWithoutRef<'header'> {
  type: 'logo' | 'title';
  title?: string;
  Lable?: string;
  onBack?: () => void;
}

const Header = ({ type, title, Lable, onBack, className, ...props }: NavigationHeaderProps) => {
  const router = useRouter();

  return (
    <header
      className={cn('flex items-center justify-between h-[44px] bg-gray-100', className)}
      {...props}
    >
      {type === 'logo' && (
        <button
          type='button'
          aria-label='홈으로 이동'
          onClick={() => router.push('/home')}
          className='cursor-pointer'
        >
          <LogoIcon className='w-[52px] h-[44px] mr-16 px-8 pl-24 box-content text-gray-500' />
        </button>
      )}

      {type === 'title' && (
        <div className='flex items-center'>
          <button
            type='button'
            className='py-2.5 pl-[6px] pr-[14px] cursor-pointer'
            onClick={onBack || router.back}
          >
            <ChevronLeftIcon />
          </button>
          {title && <h1 className='title-xsmall-weak text-gray-950'>{title}</h1>}
        </div>
      )}

      {Lable && <p className='label-large text-gray-600'>{Lable}</p>}
    </header>
  );
};

export default Header;
