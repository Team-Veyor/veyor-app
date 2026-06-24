'use client';

import { motion } from 'motion/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import AlertCircleIcon from '@/assets/icons/AlertCircleIcon';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import { cn } from '@/lib/utils';

export type ToastType = 'warning' | 'success' | 'danger';

export interface ToastProps {
  /**
   * 토스트의 상태. `warning`은 주의, `success`는 성공, `danger`는 오류/위험 상태에 사용합니다.
   * @default 'warning'
   */
  type?: ToastType;
  /** 토스트에 표시할 메시지입니다. */
  message: string;
  /** 기본 상태 아이콘 대신 표시할 커스텀 아이콘입니다. */
  icon?: ReactNode;
  /** 접근성 role. 생략하면 `type`에 맞는 기본 role을 사용합니다. */
  role?: ComponentPropsWithoutRef<'div'>['role'];
  /** 외부에서 주입할 Tailwind 클래스. 최종 override 지점입니다. */
  className?: string;
}

const ICON_CLASSES: Record<ToastType, string> = {
  warning: 'text-icon-warning-process-weak',
  success: 'text-icon-brand-weak',
  danger: 'text-icon-danger-weak',
};

const TOAST_ROLE: Record<ToastType, ComponentPropsWithoutRef<'div'>['role']> = {
  warning: 'status',
  success: 'status',
  danger: 'alert',
};

const TOAST_TRANSITION = {
  type: 'tween',
  duration: 0.22,
  ease: [0.25, 0.1, 0.25, 1],
} as const;

const DefaultToastIcon = ({ type }: { type: ToastType }) => {
  if (type === 'success') {
    return <CheckCircleIcon className={cn('size-24 shrink-0', ICON_CLASSES[type])} />;
  }

  return <AlertCircleIcon className={cn('size-24 shrink-0', ICON_CLASSES[type])} />;
};

/**
 * 짧은 상태 메시지를 화면 위에 띄우는 토스트 UI 컴포넌트.
 * 전역 표시/숨김 상태와 자동 종료 타이머는 `ToastProvider`가 관리합니다.
 */
export const Toast = ({ type = 'warning', message, icon, className, role }: ToastProps) => {
  return (
    <motion.div
      role={role ?? TOAST_ROLE[type]}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={TOAST_TRANSITION}
      className={cn(
        'inline-flex max-w-[247px] transform-gpu items-center gap-8 rounded-16 bg-black-alpha-30 px-16 py-12 text-white backdrop-blur-lg',
        className,
      )}
    >
      {icon ?? <DefaultToastIcon type={type} />}
      <span className='label-small'>{message}</span>
    </motion.div>
  );
};

export default Toast;
