import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface OpenSourceLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: OpenSourceLayoutProps) => {
  return (
    <>
      <div className='flex h-dvh flex-col'>
        <Header type='title' title='오픈소스 라이선스' />
        <main className='min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {children}
        </main>
      </div>
      <Navigation />
    </>
  );
};

export default layout;
