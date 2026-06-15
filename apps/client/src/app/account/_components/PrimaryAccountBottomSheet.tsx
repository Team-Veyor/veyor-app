'use client';

import { useState } from 'react';
import type { Account } from '@/app/account/_types/types';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import List from '@/components/List/List';
import { cn } from '@/lib/utils';

interface PrimaryAccountBottomSheetProps {
  /** 대표 계좌 후보 목록 */
  accounts: Account[];
  /** 확인 버튼 클릭 시 선택된 계좌 id를 전달합니다. */
  onConfirm: (accountId: string) => void;
  /** 바깥(backdrop) 클릭 또는 ESC로 시트가 닫힐 때 실행되는 콜백 */
  onClose?: () => void;
}

/**
 * 대표 계좌를 다시 지정하기 위한 BottomSheet.
 * 대표 계좌를 삭제했고 남은 계좌가 2개 이상일 때 표시됩니다.
 */
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
            const checked = selectedId === account.id;

            return (
              <List.Item key={account.id} onClick={() => setSelectedId(account.id)}>
                <List.Item.Leading>
                  <span aria-hidden='true' className='size-6 rounded-full bg-gray-200' />
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
