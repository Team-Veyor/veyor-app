'use client';

import Image from 'next/image';
import useAccounts from '@/app/user/_hooks/useAccounts';
import MoreIcon from '@/assets/icons/MoreIcon';
import Badge from '@/components/Badge/Badge';
import List from '@/components/List/List';

const AccountPage = () => {
  const { data: accounts } = useAccounts();
  return (
    <div>
      {accounts?.map((account) => (
        <List key={account.id}>
          <List.Item>
            <List.Item.Leading>
              <Image src={`/dummy_bank.png`} alt='은행' width={32} height={32} />
            </List.Item.Leading>
            <List.Item.Content title={account.bank} subtext={account.accountNoMasked} />
            <List.Item.Trailing>
              {account.isPrimary ? <Badge type='brand'>대표 계좌</Badge> : null}
              <MoreIcon />
            </List.Item.Trailing>
          </List.Item>
        </List>
      ))}
    </div>
  );
};

export default AccountPage;
