'use client';

import { useParams, useRouter } from 'next/navigation';
import AccountForm from '@/app/account/_components/AccountForm';
import useUpdateAccountMutation from '@/app/account/_hooks/useUpdateAccountMutation';
import type { Account, UpdateAccountRequest } from '@/app/account/_types/types';
import useAccounts from '@/app/user/_hooks/useAccounts';
import { useToast } from '@/components/Toast/ToastProvider';

const EditAccountForm = ({ account }: { account: Account }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate, isPending } = useUpdateAccountMutation(account.id);

  const handleSubmit = (changes: UpdateAccountRequest) => {
    mutate(changes, {
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

  return (
    <AccountForm
      mode='edit'
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
