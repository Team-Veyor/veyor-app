'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
  children: ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/user/account': '계좌 정보 관리',
  '/user/participations': '참여 내역',
};

const layout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();

  const isAccount = pathname === '/user/account';
  const isParticipations = pathname === '/user/participations';
  const title = PAGE_TITLES[pathname];

  return (
    <>
      <div className='flex h-dvh flex-col'>
        {title ? <Header type='title' title={title} /> : <Header type='logo' />}
        <main
          className={cn(
            'min-h-0 flex-1',
            isParticipations
              ? 'flex flex-col overflow-hidden'
              : 'flex flex-col gap-12 overflow-y-auto px-16 pt-16',
          )}
        >
          {children}
        </main>
      </div>
      {!isAccount && <Navigation />}
    </>
  );
};

export default layout;
