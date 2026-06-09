import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className='flex flex-col h-dvh pb-[32px]'>
      <Header type='title' />
      {children}
    </div>
  );
};

export default OnboardingLayout;
