'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useDeleteAccountMutation from '@/app/account/_hooks/useDeleteAccountMutation';
import useSetPrimaryAccountMutation from '@/app/account/_hooks/useSetPrimaryAccountMutation';
import type { Account } from '@/app/account/_types/types';
import useAccounts from '@/app/user/_hooks/useAccounts';
import MoreIcon from '@/assets/icons/MoreIcon';
import PlusIcon from '@/assets/icons/PlusIcon';
import Badge from '@/components/Badge/Badge';
import List from '@/components/List/List';
import Menu from '@/components/Menu/Menu';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import WarningModal from '@/components/Modal/WarningModal';

interface AccountMenuItem {
  label: string;
  onSelect: () => void;
}

const AccountPage = () => {
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToSetPrimary, setAccountToSetPrimary] = useState<Account | null>(null);

  const router = useRouter();

  const { data: accounts } = useAccounts();
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

    setPrimary(accountToSetPrimary.id, {
      onSuccess: () => setAccountToSetPrimary(null),
    });
  };

  const handleConfirmDelete = () => {
    if (!accountToDelete || isDeleting) return;

    deleteAccount(accountToDelete.id, {
      onSuccess: () => setAccountToDelete(null),
    });
  };

  return (
    <>
      {accounts?.map((account) => (
        <List key={account.id}>
          <List.Item>
            <List.Item.Leading>
              <Image src={`/dummy_bank.png`} alt='은행' width={32} height={32} />
            </List.Item.Leading>
            <List.Item.Content title={account.bank} subtext={account.accountNoMasked} />
            <List.Item.Trailing>
              {account.isPrimary ? <Badge type='brand'>대표 계좌</Badge> : null}

              <Menu trigger={<MoreIcon className='cursor-pointer' />}>
                {createAccountMenuItems(account).map((item) => (
                  <Menu.Item
                    key={item.label}
                    onClick={item.onSelect}
                    className={item.label === '삭제' ? 'text-red-500' : undefined}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            </List.Item.Trailing>
          </List.Item>
        </List>
      ))}

      <List>
        <List.Item onClick={() => router.push('/account/new')}>
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
    </>
  );
};

export default AccountPage;
