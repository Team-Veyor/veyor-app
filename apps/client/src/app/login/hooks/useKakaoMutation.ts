import { useMutation } from '@tanstack/react-query';
import { loginWithKakao } from '@/app/login/apis/auth';

const useKakaoMutation = () => {
  return useMutation({
    mutationFn: loginWithKakao,
  });
};

export default useKakaoMutation;
