'use client';

import { useParams, useRouter } from 'next/navigation';
import AccountForm from '@/app/account/_components/AccountForm';
import useUpdateAccountMutation from '@/app/account/_hooks/useUpdateAccountMutation';
import type { Account, CreateAccountRequest } from '@/app/account/_types/types';
import useAccounts from '@/app/user/_hooks/useAccounts';

const EditAccountForm = ({ account }: { account: Account }) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdateAccountMutation(account.id);

  const handleSubmit = (form: CreateAccountRequest) => {
    mutate(form, {
      onSuccess: () => router.replace('/user/account'),
    });
  };

  return (
    <AccountForm
      initialForm={{ bank: account.bank, holderName: account.holderName }}
      accountNoPlaceholder={account.accountNoMasked}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
    />
  );
};

const EditAccountPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: accounts } = useAccounts();

  const account = accounts?.find((item) => item.id === id);

  if (!account) {
    return null;
  }

  return <EditAccountForm account={account} />;
};

export default EditAccountPage;
