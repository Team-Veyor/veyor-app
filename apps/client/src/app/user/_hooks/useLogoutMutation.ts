import { useMutation } from '@tanstack/react-query';
import { logout } from '@/app/user/_apis/users';

const useLogoutMutation = () => {
  return useMutation<void, Error, void>({
    mutationFn: logout,
  });
};

export default useLogoutMutation;
