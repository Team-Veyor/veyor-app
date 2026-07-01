'use client';

import Login from '@/app/login/_components/Login';
import useSessionRedirect from '@/app/login/_hooks/useSessionRedirect';
import Spinner from '@/components/Spinner/Spinner';

export default function RootPage() {
  const { isCheckingSession } = useSessionRedirect();

  if (isCheckingSession) {
    return (
      <main className='flex min-h-dvh items-center justify-center bg-gray-50 px-5'>
        <Spinner size={32} label='로그인 정보를 확인하는 중' />
      </main>
    );
  }

  return <Login />;
}
