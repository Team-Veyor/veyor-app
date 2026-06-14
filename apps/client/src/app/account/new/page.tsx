'use client';

import { useRouter } from 'next/navigation';
import AccountForm from '@/app/account/_components/AccountForm';
import useCreateAccountMutation from '@/app/account/_hooks/useCreateAccountMutation';
import type { CreateAccountRequest } from '@/app/account/_types/types';

const AddAccountPage = () => {
  const router = useRouter();

  const { mutate, isPending } = useCreateAccountMutation();

  const handleSubmit = (form: CreateAccountRequest) => {
    mutate(form, {
      onSuccess: () => router.replace('/home'),
    });
  };

  return <AccountForm isSubmitting={isPending} onSubmit={handleSubmit} />;
};

export default AddAccountPage;
