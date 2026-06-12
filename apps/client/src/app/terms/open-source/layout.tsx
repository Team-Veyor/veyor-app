import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';

interface OpenSourceLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: OpenSourceLayoutProps) => {
  return (
    <>
      <Header type='title' title='오픈소스 라이선스' />
      <main className='flex flex-col min-h-dvh px-16 pt-16 gap-12'>{children}</main>
    </>
  );
};

export default layout;
