import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface UserLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: UserLayoutProps) => {
  return (
    <>
      <Header type='logo' />
      <main className='flex flex-col min-h-dvh px-16 pt-16 gap-12'>{children}</main>
      <Navigation />
    </>
  );
};

export default layout;
