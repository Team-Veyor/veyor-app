import type { InputHTMLAttributes, ReactNode } from 'react';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import { cn } from '@/lib/utils';

type RadioButtonVariant = 'outlined' | 'filled';

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 라디오 버튼에 표시할 라벨 */
  label: ReactNode;
  /** 왼쪽에 체크 아이콘을 표시할지 여부 */
  hasLeftIcon?: boolean;
  /** 오른쪽에 체크 아이콘을 표시할지 여부 */
  hasRightIcon?: boolean;
  /** 라디오 버튼의 시각적 스타일. `filled`는 배경 채움, `outlined`는 테두리만 표시합니다. */
  variant?: RadioButtonVariant;
}

const VARIANT_CLASSES = {
  outlined:
    'border border-gray-200 bg-transparent text-gray-600 peer-checked:border-gray-900 peer-checked:text-gray-900 peer-checked:[&_.radio-icon]:text-gray-900',
  filled:
    'border-transparent bg-gray-50 text-gray-600 peer-checked:text-gray-950 peer-checked:[&_.radio-icon]:text-brand-500',
};

/**
 * 라벨과 체크 아이콘을 포함한 라디오 버튼 컴포넌트.
 * 같은 `name`을 가진 RadioButton끼리 그룹으로 동작합니다.
 */
const RadioButton = ({
  label,
  className,
  hasLeftIcon = false,
  hasRightIcon = false,
  variant = 'filled',
  disabled,
  ...props
}: RadioButtonProps) => {
  const leftIcon = hasLeftIcon && <CheckCircleIcon />;
  const rightIcon = hasRightIcon && <CheckCircleIcon />;

  return (
    <label className={cn('inline-flex cursor-pointer', disabled && 'cursor-not-allowed')}>
      <input type='radio' className='peer sr-only' disabled={disabled} {...props} />
      <span
        className={cn(
          'label-large flex min-w-[148px] items-center justify-between gap-12 rounded-16 p-16 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
          VARIANT_CLASSES[variant],
          className,
        )}
      >
        {leftIcon}
        <span>{label}</span>
        {rightIcon}
      </span>
    </label>
  );
};

export default RadioButton;
