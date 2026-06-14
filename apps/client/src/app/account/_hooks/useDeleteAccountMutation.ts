import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccount } from '@/app/account/_apis/accounts';
import { ACCOUNTS_QUERY_KEY } from '@/app/user/_hooks/useAccounts';

const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};

export default useDeleteAccountMutation;
