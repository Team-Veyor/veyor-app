'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getBankLogo } from '@/app/account/_constants/banks';
import type { Account } from '@/app/account/_types/types';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import List from '@/components/List/List';
import { cn } from '@/lib/utils';

interface PrimaryAccountBottomSheetProps {
  accounts: Account[];
  onConfirm: (accountId: string) => void;
  onClose?: () => void;
}

const PrimaryAccountBottomSheet = ({
  accounts,
  onConfirm,
  onClose,
}: PrimaryAccountBottomSheetProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <BottomSheet
      onClose={onClose}
      footer={
        <Button
          variant='secondary'
          size='large'
          disabled={!selectedId}
          onClick={() => selectedId && onConfirm(selectedId)}
        >
          확인
        </Button>
      }
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='title-small text-gray-950'>대표 계좌를 선택해주세요</h2>
          <p className='subtext-medium text-gray-500'>리워드는 대표 계좌로 지급됩니다.</p>
        </div>

        <List role='radiogroup' className='bg-transparent px-0'>
          {accounts.map((account) => {
            const logo = getBankLogo(account.bank);
            const checked = selectedId === account.id;

            return (
              <List.Item
                key={account.id}
                className='focus:outline-none'
                onClick={() => setSelectedId(account.id)}
              >
                <List.Item.Leading>
                  <Image src={logo.icon} alt='' width={24} height={24} className='size-6' />
                </List.Item.Leading>
                <List.Item.Content>
                  <span className='flex flex-col items-start gap-[2px]'>
                    <span className='label-medium text-gray-950'>{account.bank}</span>
                    <span className='subtext-medium text-gray-500'>{account.accountNoMasked}</span>
                  </span>
                </List.Item.Content>
                <List.Item.Trailing>
                  <CheckCircleIcon className={cn(checked ? 'text-brand-500' : 'text-gray-200')} />
                </List.Item.Trailing>
              </List.Item>
            );
          })}
        </List>
      </div>
    </BottomSheet>
  );
};

export default PrimaryAccountBottomSheet;
