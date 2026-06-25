'use client';

import { useState } from 'react';
import { getBankLogo } from '@/app/account/_constants/banks';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import { cn } from '@/lib/utils';

interface BankSelectBottomSheetProps {
  banks: string[];
  selectedBank?: string;
  onConfirm: (bank: string) => void;
  onClose?: () => void;
}

const BankSelectBottomSheet = ({
  banks,
  selectedBank,
  onConfirm,
  onClose,
}: BankSelectBottomSheetProps) => {
  const [selected, setSelected] = useState<string | null>(selectedBank ?? null);

  return (
    <BottomSheet
      onClose={onClose}
      footer={
        <Button
          variant='secondary'
          size='large'
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
        >
          확인
        </Button>
      }
    >
      <div className='flex flex-col gap-5'>
        <h2 className='title-small text-gray-950'>은행을 선택해주세요</h2>

        <ul className='scrollbar-custom grid h-[443px] w-full grid-cols-3 gap-2 overflow-y-auto py-0.5 pr-1.5 pl-0.5'>
          {banks.map((bank) => {
            const logo = getBankLogo(bank);
            const checked = selected === bank;

            return (
              <li key={bank}>
                <button
                  type='button'
                  onClick={() => setSelected(bank)}
                  aria-pressed={checked}
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-center gap-2 rounded-20 bg-white py-12 transition-colors focus:outline-none',
                    checked
                      ? 'ring-1 ring-border-select bg-fill-tertiary'
                      : 'ring-1 ring-transparent bg-fill-quaternary',
                  )}
                >
                  {/** biome-ignore lint/performance/noImgElement: 정적 SVG 아이콘 */}
                  <img
                    src={logo.icon}
                    alt=''
                    width={28}
                    height={28}
                    className='size-7 object-contain'
                  />
                  <span className='label-medium text-gray-950'>{logo.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </BottomSheet>
  );
};

export default BankSelectBottomSheet;
