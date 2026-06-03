'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/app/login/apis/users';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('로그인 정보를 확인하는 중...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        throw new Error('로그인 세션을 찾을 수 없어요. 다시 로그인해 주세요.');
      }

      const me = await getUser();
      router.replace(me.onboarded ? '/home' : '/onboarding');
    };

    handleCallback().catch(async (error) => {
      await supabase.auth.signOut();
      setMessage(error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했어요.');
      window.setTimeout(() => router.replace('/login'), 1500);
    });
  }, [router]);

  return (
    <main className='flex min-h-dvh items-center justify-center bg-gray-50 px-5'>
      <p className='body-medium text-gray-600'>{message}</p>
    </main>
  );
}
