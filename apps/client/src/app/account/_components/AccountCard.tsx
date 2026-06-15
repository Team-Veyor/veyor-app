import Image from 'next/image';
import { getBankLogo } from '@/app/account/_constants/banks';
import type { Account } from '@/app/account/_types/types';
import MoreIcon from '@/assets/icons/MoreIcon';
import Badge from '@/components/Badge/Badge';
import List from '@/components/List/List';
import Menu from '@/components/Menu/Menu';

export interface AccountMenuItem {
  label: string;
  onSelect: () => void;
}

interface AccountCardProps {
  account: Account;
  menuItems: AccountMenuItem[];
}

const AccountCard = ({ account, menuItems }: AccountCardProps) => {
  const logo = getBankLogo(account.bank);

  return (
    <List>
      <List.Item>
        <List.Item.Leading>
          <Image src={logo.icon} alt={logo.label} width={32} height={32} />
        </List.Item.Leading>
        <List.Item.Content title={account.bank} subtext={account.accountNoMasked} />
        <List.Item.Trailing>
          {account.isPrimary ? <Badge type='brand'>대표 계좌</Badge> : null}

          <Menu trigger={<MoreIcon className='cursor-pointer' />}>
            {menuItems.map((item) => (
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
  );
};

export default AccountCard;
