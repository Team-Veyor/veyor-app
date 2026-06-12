import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface ParticipationsLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: ParticipationsLayoutProps) => {
  return (
    <>
      <div className='flex h-dvh flex-col'>
        <Header type='title' title='참여 내역' />
        <main className='flex min-h-0 flex-1 flex-col'>{children}</main>
      </div>
      <Navigation />
    </>
  );
};

export default layout;
