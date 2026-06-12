'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface PolicyLayoutProps {
  children: ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/policy/consents': '서비스 이용 동의',
  '/policy/terms': '이용 약관',
  '/policy/open-source': '오픈소스 라이선스',
};

const layout = ({ children }: PolicyLayoutProps) => {
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] ?? '';

  return (
    <>
      <div className='flex h-dvh flex-col'>
        <Header type='title' title={title} />
        <main className='min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] scrollbar-hide [&::-webkit-scrollbar]:hidden'>
          {children}
        </main>
      </div>
      <Navigation />
    </>
  );
};

export default layout;
