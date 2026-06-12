'use client';

import { useState } from 'react';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import List from '@/components/List/List';
import { cn } from '@/lib/utils';

export interface SelectOption {
  /** 선택값으로 사용되는 고유 값 */
  value: string;
  /** 화면에 표시되는 라벨 */
  label: string;
}

interface SelectProps {
  /** 선택 가능한 옵션 목록 */
  options: SelectOption[];
  /** 현재 선택된 값 */
  value?: string;
  /** 옵션 선택 시 호출되는 콜백 */
  onChange?: (value: string) => void;
  /** 값이 없을 때 표시되는 안내 문구 */
  placeholder?: string;
  /** BottomSheet 상단에 표시할 제목 */
  title?: string;
  /** 비활성 상태 */
  disabled?: boolean;
  /** 외곽 트리거 `<button>`에 적용할 Tailwind 클래스 */
  wrapperClassName?: string;
  /** 트리거 라벨 영역에 적용할 Tailwind 클래스 */
  className?: string;
}

/**
 * Input과 동일한 외형을 공유하는 Select 컴포넌트.
 * 클릭하면 BottomSheet가 열리고, 옵션을 선택하면 닫힙니다.
 */
const Select = ({
  options,
  value,
  onChange,
  placeholder = '선택해 주세요',
  title,
  disabled,
  wrapperClassName,
  className,
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  const wrapperClasses =
    'flex w-full items-center justify-between gap-12 rounded-[16px] bg-white p-[16px] border border-gray-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60';

  const selected = options.find((option) => option.value === value);

  const handleSelect = (next: string) => {
    onChange?.(next);
    setOpen(false);
  };

  return (
    <>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(wrapperClasses, open && 'border-gray-900', wrapperClassName)}
      >
        <span
          className={cn(
            'body-large-strong text-left',
            selected ? 'text-gray-900' : 'text-gray-500',
            className,
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon className='size-24 shrink-0 text-gray-500' />
      </button>

      {open && (
        <BottomSheet onClose={() => setOpen(false)}>
          <div className='flex flex-col gap-12'>
            {title && <h2 className='label-large text-gray-900'>{title}</h2>}
            <List className='bg-transparent px-0'>
              {options.map((option) => (
                <List.Item
                  key={option.value + option.label}
                  onClick={() => handleSelect(option.value)}
                >
                  <List.Item.Content>
                    <span
                      className={cn(
                        'body-large-strong',
                        option.value === value ? 'text-gray-900' : 'text-gray-600',
                      )}
                    >
                      {option.label}
                    </span>
                  </List.Item.Content>
                </List.Item>
              ))}
            </List>
          </div>
        </BottomSheet>
      )}
    </>
  );
};

export default Select;
