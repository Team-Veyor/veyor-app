'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { getAmplitudeExitPoint, initializeAmplitude, trackAmplitudeEvent } from '@/lib/amplitude';
import { supabase } from '@/lib/supabase';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    initializeAmplitude();
  }, []);

  useEffect(() => {
    const trackServiceExit = () => {
      trackAmplitudeEvent('service_exit', { exit_point: getAmplitudeExitPoint(pathname) });
    };

    window.addEventListener('pagehide', trackServiceExit);
    return () => window.removeEventListener('pagehide', trackServiceExit);
  }, [pathname]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
