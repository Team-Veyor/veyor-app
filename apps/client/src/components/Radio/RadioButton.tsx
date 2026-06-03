import type { InputHTMLAttributes, ReactNode } from 'react';
import CheckIcon from '@/assets/icons/CheckIcon';
import { cn } from '@/lib/utils';

export type RadioButtonVariant = 'outlined' | 'filled';

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
  variant?: RadioButtonVariant;
}

const VARIANT_CLASSES = {
  outlined:
    'border border-gray-200 bg-transparent text-gray-600 peer-checked:border-gray-900 peer-checked:text-gray-900 peer-checked:[&_.radio-icon]:text-gray-900',
  filled:
    'border-transparent bg-gray-50 text-gray-600 peer-checked:text-gray-950 peer-checked:[&_.radio-icon]:text-[#00C896]',
};

const RadioButton = ({
  label,
  className,
  hasLeftIcon = false,
  hasRightIcon = false,
  variant = 'filled',
  disabled,
  ...props
}: RadioButtonProps) => {
  return (
    <label className={cn('inline-flex cursor-pointer', disabled && 'cursor-not-allowed')}>
      <input type='radio' className='peer sr-only' disabled={disabled} {...props} />
      <span
        className={cn(
          // TODO: Primary Color 변경
          'label-large flex min-w-full items-center justify-center gap-3 rounded-2xl p-4 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F9BFF]',
          VARIANT_CLASSES[variant],
          className,
        )}
      >
        {hasLeftIcon && <CheckIcon />}
        <span>{label}</span>
        {hasRightIcon && <CheckIcon />}
      </span>
    </label>
  );
};

export default RadioButton;
