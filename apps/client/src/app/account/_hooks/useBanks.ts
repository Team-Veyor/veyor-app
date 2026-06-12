import { useQuery } from '@tanstack/react-query';
import { getBanks } from '@/app/account/_apis/accounts';
import { ACCOUNTS_QUERY_KEY } from '@/app/user/_hooks/useAccounts';

export const BANKS_QUERY_KEY = [...ACCOUNTS_QUERY_KEY, 'banks'] as const;

const useBanks = () =>
  useQuery({
    queryKey: BANKS_QUERY_KEY,
    queryFn: getBanks,
    staleTime: Infinity,
  });

export default useBanks;
