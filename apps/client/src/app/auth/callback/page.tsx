'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getUser } from '@/app/login/_apis/users';
import { LOGIN_ERROR_MESSAGE } from '@/app/login/_constants/constants';
import Spinner from '@/components/Spinner/Spinner';
import { useToast } from '@/components/Toast/ToastProvider';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const hasHandledCallback = useRef(false);

  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

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

    handleCallback().catch(async () => {
      await supabase.auth.signOut();
      showToast({ type: 'warning', message: LOGIN_ERROR_MESSAGE.default });
      router.replace('/login');
    });
  }, [router, showToast]);

  return (
    <main className='flex min-h-dvh items-center justify-center bg-gray-50 px-5'>
      <Spinner size={32} label='로그인 정보를 확인하는 중' />
    </main>
  );
}
