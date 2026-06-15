'use client';

import { AnimatePresence } from 'motion/react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import Toast, { type ToastType } from './Toast';

export interface ToastOptions {
  /** 토스트의 상태 톤. */
  type?: ToastType;
  /** 토스트에 표시할 메시지입니다. */
  message: string;
  /** 기본 상태 아이콘 대신 표시할 커스텀 아이콘입니다. */
  icon?: ReactNode;
  /** 토스트가 자동으로 사라지기까지의 시간(ms). 0 이하이면 자동으로 닫히지 않습니다. */
  duration?: number;
}

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
  icon?: ReactNode;
  duration: number;
}

interface ToastContextValue {
  /** 전역 토스트를 표시합니다. */
  showToast: (toast: ToastOptions) => void;
  /** 현재 표시 중인 토스트를 닫습니다. */
  hideToast: () => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const DEFAULT_TOAST_DURATION = 1800;

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastIdRef = useRef(0);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const hideToast = useCallback(() => {
    clearCloseTimer();
    setToast(null);
  }, [clearCloseTimer]);

  const showToast = useCallback(
    (nextToast: ToastOptions) => {
      clearCloseTimer();

      const duration = nextToast.duration ?? DEFAULT_TOAST_DURATION;

      toastIdRef.current += 1;
      setToast({
        id: toastIdRef.current,
        type: nextToast.type ?? 'warning',
        message: nextToast.message,
        icon: nextToast.icon,
        duration,
      });

      if (duration > 0) {
        closeTimerRef.current = window.setTimeout(() => {
          closeTimerRef.current = null;
          setToast(null);
        }, duration);
      }
    },
    [clearCloseTimer],
  );

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className='pointer-events-none fixed top-[calc(env(safe-area-inset-top)+24px)] left-1/2 z-50 -translate-x-1/2'>
        <AnimatePresence>
          {toast && (
            <Toast key={toast.id} type={toast.type} message={toast.message} icon={toast.icon} />
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
};
