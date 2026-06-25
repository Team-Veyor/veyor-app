'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  const router = useRouter();

  return (
    <div className='flex flex-col h-dvh pb-32'>
      <Header type='title' onBack={() => router.push('/login')} />
      {children}
    </div>
  );
};

export default OnboardingLayout;
