import { useMutation } from '@tanstack/react-query';
import { loginWithKakao } from '@/app/login/_apis/auth';

const useKakaoMutation = () => {
  return useMutation({
    mutationFn: loginWithKakao,
  });
};

export default useKakaoMutation;
