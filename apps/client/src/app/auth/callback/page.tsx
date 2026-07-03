'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUser } from '@/app/login/_apis/users';
import { LOGIN_ERROR_MESSAGE } from '@/app/login/_constants/constants';
import Spinner from '@/components/Spinner/Spinner';
import { useToast } from '@/components/Toast/ToastProvider';
import {
  identifyAmplitudeUser,
  normalizeAmplitudeAcquisitionChannel,
  setAmplitudeUserProperties,
  trackAmplitudeEventOnce,
  updateAmplitudeUserProperties,
} from '@/lib/amplitude';
import { type AuthErrorStage, logAuthClientError } from '@/lib/authErrorLog';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      let stage: AuthErrorStage = 'oauth_redirect';
      const urlParams = new URLSearchParams(window.location.search);

      try {
        const redirectError = urlParams.get('error') ?? urlParams.get('error_description');
        if (redirectError) {
          throw new Error('OAuth provider returned an error.');
        }

        stage = 'missing_session';
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          throw new Error('로그인 세션을 찾을 수 없어요. 다시 로그인해 주세요.');
        }

        stage = 'fetch_user';
        const me = await getUser();
        identifyAmplitudeUser(me.id);
        setAmplitudeUserProperties({ user_id: me.id });

        if (!me.onboarded) {
          const acquisitionChannel = normalizeAmplitudeAcquisitionChannel(
            urlParams.get('utm_source'),
          );
          const signupDate = data.session.user.created_at;

          updateAmplitudeUserProperties((identify) => {
            identify.setOnce('signup_method', 'kakao_talk');
            identify.setOnce('signup_date', signupDate);
            identify.setOnce('acquisition_channel', acquisitionChannel);
          });

          trackAmplitudeEventOnce(`signup_completed:${me.id}`, 'signup_completed', {
            entry_point: '/',
            signup_method: 'kakao_talk',
            acquisition_channel: acquisitionChannel,
            user_type: 'new',
          });
        }

        router.replace(me.onboarded ? '/home' : '/onboarding');
      } catch (error) {
        await logAuthClientError({ stage, error, urlParams });
        await supabase.auth.signOut();
        showToast({ type: 'warning', message: LOGIN_ERROR_MESSAGE.default });
        router.replace('/');
      }
    };

    handleCallback();
  }, [router, showToast]);

  return (
    <main className='flex min-h-dvh items-center justify-center bg-gray-50 px-5'>
      <Spinner size={32} label='로그인 정보를 확인하는 중' />
    </main>
  );
}
