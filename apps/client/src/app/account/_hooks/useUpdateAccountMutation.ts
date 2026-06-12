import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAccount } from '@/app/account/_apis/accounts';
import type { Account, UpdateAccountRequest } from '@/app/account/_types/types';
import { ACCOUNTS_QUERY_KEY } from '@/app/user/_hooks/useAccounts';

const useUpdateAccountMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Account, Error, UpdateAccountRequest>({
    mutationFn: (body) => updateAccount(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
};

export default useUpdateAccountMutation;
