import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface HomeLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <div className='flex h-dvh flex-col'>
        <Header type='logo' />
        <main className='min-h-0 flex-1 flex flex-col gap-12 overflow-y-auto px-16 pb-16 pt-8'>
          {children}
        </main>
      </div>
      <Navigation />
    </>
  );
};

export default layout;
