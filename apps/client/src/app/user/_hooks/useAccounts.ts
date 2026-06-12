import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/app/user/_apis/accounts';

export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;

const useAccounts = () => {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: getAccounts,
  });
};

export default useAccounts;
