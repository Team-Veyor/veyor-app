import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { Size } from '@/types/types';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = Extract<Size, 'small' | 'medium' | 'large'>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES = {
  primary: 'bg-gray-900 text-gray-50 hover:bg-gray-800',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-[#F74F4F] text-gray-50 hover:bg-[#F74F4F]/80',
};

const SIZE_CLASSES = {
  small: 'px-2',
  medium: 'px-2',
  large: 'px-6 py-3 label-large',
};

const Button = ({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type='button'
      className={cn(
        'flex w-full items-center justify-center rounded-[20px] shadow-[inset_0_0_12px_0_rgba(255,255,255,0.80)] transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
