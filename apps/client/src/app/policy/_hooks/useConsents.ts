import { useQuery } from '@tanstack/react-query';
import getConsents from '@/app/policy/_apis/consents';
import type { Consent } from '@/app/policy/_types/types';

export const CONSENTS_QUERY_KEY = ['consents'] as const;

const useConsents = () => {
  return useQuery<Consent[]>({
    queryKey: CONSENTS_QUERY_KEY,
    queryFn: getConsents,
  });
};

export default useConsents;
