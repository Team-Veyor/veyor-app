import type { InputHTMLAttributes, ReactNode } from 'react';
import CheckIcon from '@/assets/icons/CheckIcon';
import { cn } from '@/lib/utils';

type RadioButtonVariant = 'outlined' | 'filled';

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
  const iconSpace = <div className='size-6' />;

  const leftIcon = hasLeftIcon ? <CheckIcon /> : iconSpace;
  const rightIcon = hasRightIcon ? <CheckIcon /> : iconSpace;

  return (
    <label className={cn('inline-flex cursor-pointer', disabled && 'cursor-not-allowed')}>
      <input type='radio' className='peer sr-only' disabled={disabled} {...props} />
      <span
        className={cn(
          // TODO: Primary Color 변경
          'label-large flex min-w-[148px] items-center justify-center gap-3 rounded-2xl p-4 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F9BFF]',
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
