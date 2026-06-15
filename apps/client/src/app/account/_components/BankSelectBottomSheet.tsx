'use client';

import { useState } from 'react';
import { getBankMeta } from '@/app/account/_constants/banks';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import { cn } from '@/lib/utils';

interface BankSelectBottomSheetProps {
  /** API(`GET /accounts/banks`)가 반환한 은행명 목록 */
  banks: string[];
  /** 현재 선택된 은행명. 시트를 다시 열 때 초기 선택값으로 사용됩니다. */
  selectedBank?: string;
  /** 확인 버튼 클릭 시 선택된 은행명을 전달합니다. */
  onConfirm: (bank: string) => void;
  /** 바깥(backdrop) 클릭 또는 ESC로 시트가 닫힐 때 실행되는 콜백 */
  onClose?: () => void;
}

/**
 * 은행을 그리드로 나열해 선택하는 BottomSheet.
 * 본문(grid)은 최대 433px 너비로 가운데 정렬되며 세로로 스크롤됩니다.
 */
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

        <ul className='scrollbar-custom grid max-h-[433px] w-full grid-cols-3 gap-2 overflow-y-auto py-0.5 pr-1.5 pl-0.5'>
          {banks.map((bank) => {
            const meta = getBankMeta(bank);
            const checked = selected === bank;

            return (
              <li key={bank}>
                <button
                  type='button'
                  onClick={() => setSelected(bank)}
                  aria-pressed={checked}
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-center gap-2 rounded-20 bg-white py-12 transition-colors',
                    checked ? 'ring-2 ring-brand-500' : 'ring-1 ring-transparent',
                  )}
                >
                  {/** biome-ignore lint/performance/noImgElement: 정적 SVG 아이콘 */}
                  <img
                    src={meta.icon}
                    alt=''
                    width={28}
                    height={28}
                    className='size-7 object-contain'
                  />
                  <span className='label-medium text-gray-950'>{meta.label}</span>
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
