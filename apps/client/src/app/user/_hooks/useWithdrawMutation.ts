import { useMutation } from '@tanstack/react-query';
import { withdraw } from '@/app/user/_apis/users';

const useWithdrawMutation = () => {
  return useMutation<void, Error, void>({
    mutationFn: withdraw,
  });
};

export default useWithdrawMutation;
