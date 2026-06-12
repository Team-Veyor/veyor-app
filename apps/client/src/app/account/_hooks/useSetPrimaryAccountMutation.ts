import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setPrimaryAccount } from '@/app/account/_apis/accounts';
import { ACCOUNTS_QUERY_KEY } from '@/app/user/_hooks/useAccounts';

const useSetPrimaryAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setPrimaryAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};

export default useSetPrimaryAccountMutation;
