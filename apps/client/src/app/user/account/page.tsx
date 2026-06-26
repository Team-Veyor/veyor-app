'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AccountCard, { type AccountMenuItem } from '@/app/account/_components/AccountCard';
import AccountSkeleton from '@/app/account/_components/AccountSkeleton';
import PrimaryAccountBottomSheet from '@/app/account/_components/PrimaryAccountBottomSheet';
import useDeleteAccountMutation from '@/app/account/_hooks/useDeleteAccountMutation';
import useSetPrimaryAccountMutation from '@/app/account/_hooks/useSetPrimaryAccountMutation';
import type { Account } from '@/app/account/_types/types';
import useAccounts from '@/app/user/_hooks/useAccounts';
import PlusIcon from '@/assets/icons/PlusIcon';
import Button from '@/components/Button/Button';
import List from '@/components/List/List';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import Modal from '@/components/Modal/Modal';
import WarningModal from '@/components/Modal/WarningModal';
import { useToast } from '@/components/Toast/ToastProvider';
import { trackAmplitudeEvent } from '@/lib/amplitude';

type PrimarySelectionView = 'bottomSheet' | 'requiredModal';

interface PrimarySelectionState {
  candidates: Account[];
  view: PrimarySelectionView | null;
}

const AccountPage = () => {
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToSetPrimary, setAccountToSetPrimary] = useState<Account | null>(null);
  const [primarySelection, setPrimarySelection] = useState<PrimarySelectionState>({
    candidates: [],
    view: null,
  });

  const router = useRouter();

  const { showToast } = useToast();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isPending: isPendingAccounts,
  } = useAccounts();
  const { mutate: setPrimary, isPending: isSettingPrimary } = useSetPrimaryAccountMutation();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccountMutation();

  const createAccountMenuItems = (account: Account): AccountMenuItem[] => [
    ...(!account.isPrimary
      ? [{ label: '대표 계좌로 선택', onSelect: () => setAccountToSetPrimary(account) }]
      : []),
    { label: '수정', onSelect: () => router.push(`/account/${account.id}/edit`) },
    { label: '삭제', onSelect: () => setAccountToDelete(account) },
  ];

  const handleConfirmSetPrimary = () => {
    if (!accountToSetPrimary || isSettingPrimary) return;

    const previousPrimaryAccount = accounts?.find((account) => account.isPrimary);

    setPrimary(accountToSetPrimary.id, {
      onSuccess: () => {
        trackAmplitudeEvent('default_account_changed', {
          previous_bank_name: previousPrimaryAccount?.bank,
          new_bank_name: accountToSetPrimary.bank,
          account_count: accounts?.length ?? 0,
        });
        setAccountToSetPrimary(null);
        showToast({ type: 'success', message: '대표 계좌로 선택되었습니다.' });
      },
      onError: () => {
        showToast({
          type: 'warning',
          message: '대표 계좌 선택에 실패했습니다. 다시 시도해주세요.',
        });
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!accountToDelete || isDeleting) return;

    const deletedAccount = accountToDelete;
    const remaining = (accounts ?? []).filter((account) => account.id !== deletedAccount.id);

    deleteAccount(deletedAccount.id, {
      onSuccess: () => {
        trackAmplitudeEvent('account_deleted', {
          account_count: remaining.length,
          account_default: deletedAccount.isPrimary,
        });
        setAccountToDelete(null);
        showToast({ type: 'success', message: '계좌가 삭제되었습니다.' });

        if (!deletedAccount.isPrimary) return;

        if (remaining.length === 0) {
          router.push('/account/new');
          return;
        }

        if (remaining.length === 1) {
          setPrimary(remaining[0].id, {
            onSuccess: () => {
              trackAmplitudeEvent('default_account_changed', {
                previous_bank_name: deletedAccount.bank,
                new_bank_name: remaining[0].bank,
                account_count: remaining.length,
              });
            },
          });
          return;
        }

        setPrimarySelection({ candidates: remaining, view: 'bottomSheet' });
      },
    });
  };

  const handlePrimaryBottomSheetClose = () => {
    setPrimarySelection((prev) => ({ ...prev, view: 'requiredModal' }));
  };

  const handleOpenPrimaryBottomSheet = () => {
    setPrimarySelection((prev) => ({ ...prev, view: 'bottomSheet' }));
  };

  const handleSelectPrimaryCandidate = (accountId: string) => {
    if (isSettingPrimary) return;

    const selectedAccount = primarySelection.candidates.find((account) => account.id === accountId);
    const previousPrimaryAccount = accounts?.find((account) => account.isPrimary);

    setPrimary(accountId, {
      onSuccess: () => {
        trackAmplitudeEvent('default_account_changed', {
          previous_bank_name: previousPrimaryAccount?.bank,
          new_bank_name: selectedAccount?.bank,
          account_count: accounts?.length ?? primarySelection.candidates.length,
        });
        setPrimarySelection({ candidates: [], view: null });
        showToast({ type: 'success', message: '대표 계좌로 선택되었습니다.' });
      },
    });
  };

  if (isPendingAccounts || isLoadingAccounts) {
    return <AccountSkeleton />;
  }

  return (
    <>
      {accounts?.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          menuItems={createAccountMenuItems(account)}
        />
      ))}

      <List>
        <List.Item
          onClick={() => {
            trackAmplitudeEvent('account_added_clicked');
            router.push('/account/new');
          }}
        >
          <List.Item.Content title='내 계좌 추가하기' />
          <List.Item.Trailing>
            <PlusIcon />
          </List.Item.Trailing>
        </List.Item>
      </List>

      {accountToSetPrimary && (
        <ConfirmModal
          title='대표 계좌로 선택할까요?'
          description='이후 리워드는 변경한 계좌로 지급됩니다. '
          leftButtonText='아니요'
          rightButtonText='예'
          onLeftButtonClick={() => setAccountToSetPrimary(null)}
          onRightButtonClick={handleConfirmSetPrimary}
        />
      )}

      {accountToDelete && (
        <WarningModal
          title='등록된 계좌를 삭제할까요?'
          description={'삭제된 계좌 정보는 복구할 수 없습니다.'}
          leftButtonText='취소'
          rightButtonText='삭제'
          onLeftButtonClick={() => setAccountToDelete(null)}
          onRightButtonClick={handleConfirmDelete}
        />
      )}

      {primarySelection.view === 'requiredModal' && (
        <Modal title='대표 계좌를 선택해주세요' description='리워드는 대표 계좌로 지급됩니다.'>
          <Button
            variant='secondary'
            theme='dark'
            size='medium'
            hasGlow={false}
            onClick={handleOpenPrimaryBottomSheet}
          >
            선택하기
          </Button>
        </Modal>
      )}

      {primarySelection.view === 'bottomSheet' && primarySelection.candidates.length > 0 && (
        <PrimaryAccountBottomSheet
          accounts={primarySelection.candidates}
          onConfirm={handleSelectPrimaryCandidate}
          onClose={handlePrimaryBottomSheetClose}
        />
      )}
    </>
  );
};

export default AccountPage;
