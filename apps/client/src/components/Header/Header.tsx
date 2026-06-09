'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon';
import LogoIcon from '@/assets/icons/LogoIcon';

interface NavigationHeaderProps {
  type: 'logo' | 'title';
  title?: string;
  Lable?: string;
  onBack?: () => void;
}

const Header = ({ type, title, Lable, onBack }: NavigationHeaderProps) => {
  const router = useRouter();

  return (
    <header className='flex items-center justify-between h-[44px]'>
      {type === 'logo' && <LogoIcon className='mr-[16px] px-[8px] pl-[16px]' />}

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
