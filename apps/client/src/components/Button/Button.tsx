'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { Size } from '@/types/types';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonTheme = 'light' | 'dark';
type ButtonSize = Extract<Size, 'small' | 'medium' | 'large'>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 의미. `primary`는 주요 액션(브랜드), `secondary`는 보조 액션, `danger`는 삭제·경고 액션입니다. */
  variant?: ButtonVariant;
  /** 채움 명도. `dark`는 진한 배경에 밝은 글자, `light`는 연한 배경에 진한 글자입니다. */
  theme?: ButtonTheme;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 안쪽 광(glow) 효과 on/off */
  hasGlow?: boolean;
  /** 로딩 상태. true일 때 로띠 애니메이션을 표시하고 버튼을 비활성화합니다. */
  isLoading?: boolean;
}

const VARIANT_CLASSES = {
  primary: {
    dark: 'bg-brand-500 text-white after:bg-brand-alpha-30',
    light: 'bg-brand-alpha-10 text-brand-500 after:bg-brand-alpha-10',
  },
  secondary: {
    dark: 'bg-gray-900 text-gray-50 after:bg-black-alpha-30',
    light: 'bg-gray-100 text-gray-600 after:bg-black-alpha-10',
  },
  danger: {
    dark: 'bg-red-500 text-white after:bg-red-alpha-30',
    light: 'bg-red-50 text-red-500 after:bg-red-alpha-10',
  },
} as const;

const SIZE_CLASSES = {
  small: 'py-[12px] label-small rounded-[16px]',
  medium: 'py-[16px] label-medium rounded-[18px]',
  large: 'py-[20px] label-large rounded-[20px]',
};

const LOADING_LOTTIE_SIZE_CLASSES = {
  small: 'h-[40px] w-[74px]',
  medium: 'h-[52px] w-[96px]',
  large: 'h-[64px] w-[118px]',
};

const GLOW_CLASS = 'shadow-[inset_0_0_12px_0_rgba(255,255,255,0.80)]';
const BUTTON_LOADING_LOTTIE_SRC = '/lottie/button_primary-large-loading.lottie';

/**
 * 공통 버튼 컴포넌트.
 * 표준 `<button>` 속성을 그대로 받으며, variant·theme·size·glow로 스타일을 제어합니다.
 */
const Button = ({
  variant = 'primary',
  theme = 'dark',
  size = 'medium',
  hasGlow = true,
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type='button'
      aria-busy={isLoading}
      disabled={disabled || isLoading}
      className={cn(
        'relative flex w-full items-center justify-center gap-12 overflow-hidden rounded-20 transition-colors cursor-pointer after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity enabled:hover:after:opacity-100 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant][theme],
        SIZE_CLASSES[size],
        hasGlow && GLOW_CLASS,
        disabled && !isLoading && 'opacity-40',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className='invisible'>{children}</span>
          <DotLottieReact
            src={BUTTON_LOADING_LOTTIE_SRC}
            autoplay
            loop
            className={cn(
              'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              LOADING_LOTTIE_SIZE_CLASSES[size],
            )}
            aria-hidden='true'
          />
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
