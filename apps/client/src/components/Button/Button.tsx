import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { Size } from '@/types/types';

type ButtonTheme = 'dark' | 'brand' | 'light' | 'gray';
type ButtonSize = Extract<Size, 'small' | 'medium' | 'large'>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 시각적 스타일. `dark`는 어두운 배경, `brand`는 브랜드 색상, `light`는 밝은 배경, `gray`는 회색 배경에 사용합니다. */
  theme?: ButtonTheme;
  /** 버튼 크기 */
  size?: ButtonSize;
}

const THEME_CLASSES = {
  dark: 'bg-gray-900 text-gray-50 after:bg-black-alpha-30 enabled:hover:after:opacity-100',
  brand: 'bg-brand-500 text-white after:bg-brand-alpha-30 enabled:hover:after:opacity-100',
  light: 'bg-brand-alpha-5 text-brand-500 after:bg-white-alpha-40 enabled:hover:after:opacity-100',
  gray: 'bg-gray-200 text-gray-600 after:bg-white-alpha-40 enabled:hover:after:opacity-100',
};

const SIZE_CLASSES = {
  small: 'py-[12px] label-small rounded-[16px]',
  medium: 'py-[16px] label-medium rounded-[18px]',
  large: 'py-[20px] label-large rounded-[20px]',
};

/**
 * 공통 버튼 컴포넌트.
 * 표준 `<button>` 속성을 그대로 받으며, theme와 size로 스타일을 제어합니다.
 */
const Button = ({
  theme = 'dark',
  size = 'medium',
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type='button'
      className={cn(
        'relative flex w-full items-center justify-center gap-12 overflow-hidden rounded-20 shadow-[inset_0_0_12px_0_rgba(255,255,255,0.80)] transition-colors cursor-pointer after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity disabled:cursor-not-allowed disabled:opacity-40',
        THEME_CLASSES[theme],
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
