import { useMutation } from '@tanstack/react-query';
import { loginWithKakao } from '@/app/login/_apis/auth';
import { getLoginErrorMessage } from '@/app/login/_utils/error';
import { useToast } from '@/components/Toast/ToastProvider';

const useKakaoMutation = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: loginWithKakao,
    onError: (error) => {
      showToast({ type: 'warning', message: getLoginErrorMessage(error) });
    },
  });
};

export default useKakaoMutation;
