'use client';

import { useMemo, useState } from 'react';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import CheckIcon from '@/assets/icons/CheckIcon';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';
import { cn } from '@/lib/utils';

const COLOR_CHECKED = 'text-[#00C896]';
const FOCUS_RING =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F9BFF]';

export interface AgreementItem {
  /** 약관 항목의 고유 식별자 */
  id: string;
  /** 약관 항목에 표시할 텍스트 */
  label: string;
  /** 필수 약관 여부. 기본값은 `false`(선택). */
  required?: boolean;
}

interface AgreementBottomSheetProps {
  /** 약관 항목 리스트 */
  items: AgreementItem[];
  /** 하단 버튼 클릭 시 실행되는 콜백. 동의된 약관 id 배열을 전달합니다. */
  onSubmit: (agreedIds: string[]) => void;
  /** 약관 항목의 펼침 화살표를 눌렀을 때 실행되는 콜백 */
  onItemExpand?: (id: string) => void;
  /** 바깥(backdrop) 클릭으로 시트가 닫힐 때 실행되는 콜백 */
  onClose?: () => void;
}

/**
 * 약관 동의용 BottomSheet.
 * 상단 라벨로 전체 동의/해제를 제어하며, 모든 필수 항목이 체크되어야 하단 버튼이 활성화됩니다.
 */
const AgreementBottomSheet = ({
  items,
  onSubmit,
  onItemExpand,
  onClose,
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

  return (
    <BottomSheet
      onClose={onClose}
      footer={
        <Button
          theme='brand'
          size='large'
          disabled={!canSubmit}
          onClick={() => onSubmit(Array.from(agreedIds))}
        >
          확인
        </Button>
      }
    >
      <div className='flex flex-col gap-2'>
        <AllAgreeRow label={'전체 동의'} checked={allChecked} onToggle={toggleAll} />
        <ul className='flex flex-col'>
          {items.map((item) => (
            <AgreementRow
              key={item.id}
              item={item}
              checked={agreedIds.has(item.id)}
              onToggle={() => toggleItem(item.id)}
              onExpand={onItemExpand && (() => onItemExpand(item.id))}
            />
          ))}
        </ul>
      </div>
    </BottomSheet>
  );
};

interface AllAgreeRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const AllAgreeRow = ({ label, checked, onToggle }: AllAgreeRowProps) => (
  <button
    type='button'
    onClick={onToggle}
    aria-pressed={checked}
    className={cn(
      'label-large flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-gray-100 p-4 text-left transition-colors',
      FOCUS_RING,
    )}
  >
    <CheckCircleIcon
      className={cn('transition-colors', checked ? COLOR_CHECKED : 'text-gray-200')}
    />
    <span className={checked ? 'text-gray-950' : 'text-gray-600'}>{label}</span>
  </button>
);

interface AgreementRowProps {
  item: AgreementItem;
  checked: boolean;
  onToggle: () => void;
  onExpand?: () => void;
}

const AgreementRow = ({ item, checked, onToggle, onExpand }: AgreementRowProps) => (
  <li className='flex cursor-pointer items-center gap-3 px-2 py-3'>
    <button
      type='button'
      onClick={onToggle}
      aria-pressed={checked}
      className='flex flex-1 cursor-pointer items-center gap-2 text-left'
    >
      <CheckIcon
        className={cn(
          'size-6 shrink-0 transition-colors',
          checked ? COLOR_CHECKED : 'text-gray-300',
        )}
      />
      <span className={cn('label-small', item.required ? COLOR_CHECKED : 'text-gray-500')}>
        {item.required ? '필수' : '선택'}
      </span>
      <span className='label-small-weak text-gray-900'>{item.label}</span>
    </button>

    {onExpand && (
      <button
        type='button'
        onClick={onExpand}
        aria-label={`${item.label} 자세히 보기`}
        className='flex size-6 cursor-pointer items-center justify-center text-gray-400'
      >
        <ChevronDownIcon />
      </button>
    )}
  </li>
);

export default AgreementBottomSheet;
