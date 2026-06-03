'use client';

import { useMemo, useState } from 'react';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import CheckIcon from '@/assets/icons/CheckIcon';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export interface AgreementItem {
  /** 약관 항목의 고유 식별자 */
  id: string;
  /** 약관 항목에 표시할 텍스트 */
  label: string;
  /** 필수 약관 여부. 기본값은 `false`(선택). */
  required?: boolean;
}

interface AgreementBottomSheetProps {
  /** 시트 상단 라벨(전체 동의) 영역에 표시할 텍스트 */
  label: string;
  /** 약관 항목 리스트 */
  items: AgreementItem[];
  /** 하단 버튼에 표시할 텍스트 */
  buttonText: string;
  /**
   * 하단 버튼 클릭 시 실행되는 콜백.
   * 동의된 약관 id 배열을 전달합니다.
   */
  onSubmit: (agreedIds: string[]) => void;
  /** 약관 항목의 펼침 화살표를 눌렀을 때 실행되는 콜백 */
  onItemExpand?: (id: string) => void;
}

/**
 * 약관 동의용 BottomSheet.
 * 상단 라벨로 전체 동의/해제를 제어하며, 모든 필수 항목이 체크되어야 하단 버튼이 활성화됩니다.
 */
const AgreementBottomSheet = ({
  label,
  items,
  buttonText,
  onSubmit,
  onItemExpand,
}: AgreementBottomSheetProps) => {
  const [agreedIds, setAgreedIds] = useState<Set<string>>(new Set());

  const allChecked = items.length > 0 && items.every((item) => agreedIds.has(item.id));
  const canSubmit = useMemo(
    () => items.filter((item) => item.required).every((item) => agreedIds.has(item.id)),
    [items, agreedIds],
  );

  const toggleAll = () => {
    setAgreedIds(allChecked ? new Set() : new Set(items.map((item) => item.id)));
  };

  const toggleItem = (id: string) => {
    setAgreedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    onSubmit(Array.from(agreedIds));
  };

  return (
    <BottomSheet
      footer={
        <Button variant='primary' size='large' disabled={!canSubmit} onClick={handleSubmit}>
          {buttonText}
        </Button>
      }
    >
      <div className='flex flex-col gap-2'>
        <button
          type='button'
          onClick={toggleAll}
          aria-pressed={allChecked}
          className='label-large flex w-full items-center gap-3 rounded-2xl bg-gray-100 p-4 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F9BFF] cursor-pointer'
        >
          <CheckCircleIcon
            className={cn('transition-colors', allChecked ? 'text-[#00C896]' : 'text-gray-200')}
          />
          <span className={cn(allChecked ? 'text-gray-950' : 'text-gray-600')}>{label}</span>
        </button>

        <ul className='flex flex-col'>
          {items.map((item) => {
            const checked = agreedIds.has(item.id);
            return (
              <li key={item.id} className='flex items-center gap-3 px-2 py-3 cursor-pointer'>
                <button
                  type='button'
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={checked}
                  className='flex flex-1 items-center gap-2 text-left'
                >
                  <CheckIcon
                    className={cn(
                      'size-6 shrink-0 transition-colors',
                      checked ? 'text-[#00C896]' : 'text-gray-300',
                    )}
                  />
                  <span
                    className={cn(
                      'label-small',
                      item.required ? 'text-[#00C896]' : 'text-gray-500',
                    )}
                  >
                    {item.required ? '필수' : '선택'}
                  </span>
                  <span className='label-small-weak text-gray-900'>{item.label}</span>
                </button>

                {onItemExpand && (
                  <button
                    type='button'
                    onClick={() => onItemExpand(item.id)}
                    aria-label={`${item.label} 자세히 보기`}
                    className='flex size-6 items-center justify-center text-gray-400'
                  >
                    <ChevronDownIcon />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </BottomSheet>
  );
};

export default AgreementBottomSheet;
