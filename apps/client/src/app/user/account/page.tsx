'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAccounts from '@/app/user/_hooks/useAccounts';
import MoreIcon from '@/assets/icons/MoreIcon';
import PlusIcon from '@/assets/icons/PlusIcon';
import Badge from '@/components/Badge/Badge';
import List from '@/components/List/List';
import Menu from '@/components/Menu/Menu';

interface AccountMenuItem {
  label: string;
  onSelect: () => void;
}

const createAccountMenuItems = (isPrimary: boolean): AccountMenuItem[] => [
  ...(!isPrimary ? [{ label: '대표 계좌로 선택', onSelect: () => {} }] : []),
  { label: '수정', onSelect: () => {} },
  { label: '삭제', onSelect: () => {} },
];

const AccountPage = () => {
  const { data: accounts } = useAccounts();

  const router = useRouter();

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

              <Menu trigger={<MoreIcon />}>
                {createAccountMenuItems(account.isPrimary).map((item) => (
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
        <List.Item onClick={() => router.push('/add-account')}>
          <List.Item.Content title='내 계좌 추가하기' />
          <List.Item.Trailing>
            <PlusIcon />
          </List.Item.Trailing>
        </List.Item>
      </List>
    </>
  );
};

export default AccountPage;
