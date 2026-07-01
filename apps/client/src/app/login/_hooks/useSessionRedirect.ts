import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/app/login/_apis/users';
import { supabase } from '@/lib/supabase';

const useSessionRedirect = () => {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isActive = true;

    const finishAsGuest = () => {
      if (isActive) {
        setIsCheckingSession(false);
      }
    };

    const redirectAuthenticatedUser = async () => {
      try {
        const me = await getUser();
        if (!isActive) return;

        router.replace(me.onboarded ? '/home' : '/onboarding');
      } catch {
        finishAsGuest();
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION') return;

      if (!session) {
        finishAsGuest();
        return;
      }

      void redirectAuthenticatedUser();
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return { isCheckingSession };
};

export default useSessionRedirect;
