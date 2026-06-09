import type { ReactNode } from 'react';
import Header from '@/app/onboarding/_components/Header';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className='flex flex-col h-dvh pb-[32px]'>
      <Header />
      {children}
    </div>
  );
};

export default OnboardingLayout;
