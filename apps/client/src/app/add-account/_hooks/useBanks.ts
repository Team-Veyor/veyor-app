import { useQuery } from '@tanstack/react-query';
import { getBanks } from '@/app/add-account/_apis/accounts';

export const BANKS_QUERY_KEY = ['accounts', 'banks'] as const;

const useBanks = () =>
  useQuery({
    queryKey: BANKS_QUERY_KEY,
    queryFn: getBanks,
    staleTime: Infinity,
  });

export default useBanks;
