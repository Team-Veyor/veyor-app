'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface UserLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: UserLayoutProps) => {
  const _pathname = usePathname();

  const HeaderComponent = () => {
    if (_pathname === '/user') {
      return <Header type='logo' />;
    } else if (_pathname === '/user/account') {
      return <Header type='title' title='계좌 정보 관리' />;
    }
  };

  return (
    <>
      <HeaderComponent />
      <main className='flex flex-col min-h-dvh px-16 pt-16 gap-12'>{children}</main>
      <Navigation />
    </>
  );
};

export default layout;
