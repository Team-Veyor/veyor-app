import { supabase } from '@/lib/supabase';
import { logAuthClientError } from '@/lib/authErrorLog';

export const loginWithKakao = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    await logAuthClientError({ stage: 'oauth_start', error });
    throw error;
  }
};
