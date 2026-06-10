import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface HomeLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <Header type='logo' />
      <main className='flex flex-col h-dvh px-16 pb-16 pt-8 gap-12'>{children}</main>
      <Navigation />
    </>
  );
};

export default layout;
