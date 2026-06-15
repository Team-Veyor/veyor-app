'use client';

import { useRouter } from 'next/navigation';
import AccountForm from '@/app/account/_components/AccountForm';
import useCreateAccountMutation from '@/app/account/_hooks/useCreateAccountMutation';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import { useToast } from '@/components/Toast/ToastProvider';

const AddAccountPage = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate, isPending } = useCreateAccountMutation();

  const handleSubmit = (form: CreateAccountRequest) => {
    mutate(form, {
      onSuccess: () => {
        showToast({
          type: 'success',
          message: '리워드를 지급받으실 계좌 정보가 저장되었습니다.',
        });
        router.replace('/user/account');
      },
      onError: () => {
        showToast({ type: 'warning', message: '저장에 실패했습니다. 다시 시도해주세요.' });
      },
    });
  };

  return <AccountForm isSubmitting={isPending} onSubmit={handleSubmit} />;
};

export default AddAccountPage;
