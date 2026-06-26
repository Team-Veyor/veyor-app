'use client';

import { useRouter } from 'next/navigation';
import AccountForm from '@/app/account/_components/AccountForm';
import { ACCOUNT_SUCCESS_MESSAGE, ERROR_MESSAGE } from '@/app/account/_constants/constants';
import useCreateAccountMutation from '@/app/account/_hooks/useCreateAccountMutation';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import { useToast } from '@/components/Toast/ToastProvider';
import { setAmplitudeUserProperties, trackAmplitudeEvent } from '@/lib/amplitude';
import { ApiError } from '@/lib/api';

const AddAccountPage = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate, isPending } = useCreateAccountMutation();

  const handleSubmit = (form: CreateAccountRequest) => {
    mutate(form, {
      onSuccess: () => {
        setAmplitudeUserProperties({ bank_name: form.bank });
        trackAmplitudeEvent('bank_info_completed', {
          entry_point: '/user/account',
          bank_name: form.bank,
        });
        showToast({
          type: 'success',
          message: ACCOUNT_SUCCESS_MESSAGE.save,
        });
        router.replace('/user/account');
      },
      onError: (error: Error) => {
        if (error instanceof ApiError && error.status === 409) {
          showToast({ type: 'warning', message: ERROR_MESSAGE.duplicateAccount });
          return;
        }

        showToast({ type: 'warning', message: ERROR_MESSAGE.saveError });
      },
    });
  };

  return <AccountForm isSubmitting={isPending} onSubmit={handleSubmit} />;
};

export default AddAccountPage;
