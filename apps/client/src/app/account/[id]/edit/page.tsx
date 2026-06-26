'use client';

import { useParams, useRouter } from 'next/navigation';
import AccountForm from '@/app/account/_components/AccountForm';
import { ERROR_MESSAGE } from '@/app/account/_constants/constants';
import useUpdateAccountMutation from '@/app/account/_hooks/useUpdateAccountMutation';
import type { Account, UpdateAccountRequest } from '@/app/account/_types/types';
import useAccounts from '@/app/user/_hooks/useAccounts';
import { useToast } from '@/components/Toast/ToastProvider';
import { setAmplitudeUserProperties, trackAmplitudeEvent } from '@/lib/amplitude';
import { ApiError } from '@/lib/api';

const EditAccountForm = ({ account, accountCount }: { account: Account; accountCount: number }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate, isPending } = useUpdateAccountMutation(account.id);

  const handleSubmit = (changes: UpdateAccountRequest) => {
    mutate(changes, {
      onSuccess: () => {
        setAmplitudeUserProperties({ bank_name: changes.bank ?? account.bank });
        trackAmplitudeEvent('account_edited', {
          entry_point: '/user/account',
          account_count: accountCount,
          account_default: account.isPrimary,
        });
        showToast({
          type: 'success',
          message: '리워드를 지급받으실 계좌 정보가 저장되었습니다.',
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

  return <EditAccountForm account={account} accountCount={accounts?.length ?? 0} />;
};

export default EditAccountPage;
