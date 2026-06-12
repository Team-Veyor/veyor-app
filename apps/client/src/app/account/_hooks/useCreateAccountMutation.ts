import { useMutation } from '@tanstack/react-query';
import { createAccount } from '@/app/account/_apis/accounts';
import type { Account, CreateAccountRequest } from '@/app/account/_types/types';

const useCreateAccountMutation = () =>
  useMutation<Account, Error, CreateAccountRequest>({
    mutationFn: createAccount,
  });

export default useCreateAccountMutation;
