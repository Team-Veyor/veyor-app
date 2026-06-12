import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/app/user/_apis/accounts';

const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });
};

export default useAccounts;
