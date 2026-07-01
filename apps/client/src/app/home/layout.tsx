import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Navigation from '@/components/Navigation/Navigation';

interface HomeLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: HomeLayoutProps) => {
  return (
    <div className='flex h-dvh flex-col'>
      <Header type='logo' />
      <main className='flex min-h-0 flex-1 basis-0 flex-col overflow-hidden px-16 pt-8'>
        {children}
      </main>
      <Navigation fixed={false} />
    </div>
  );
};

export default layout;
