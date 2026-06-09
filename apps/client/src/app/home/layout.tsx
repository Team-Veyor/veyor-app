import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';

interface HomeLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <Header type='logo' />
      <main className='flex flex-col h-dvh px-[16px] pt-[8px] gap-[12px]'>{children}</main>
    </>
  );
};

export default layout;
