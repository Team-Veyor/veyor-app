'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const ANIMATION_DURATION_MS = 300;

export interface BottomSheetProps {
  /** 시트 본문에 렌더링할 노드 */
  children?: ReactNode;
  /** 하단 액션 영역(보통 버튼). 지정하지 않으면 영역이 표시되지 않습니다. */
  footer?: ReactNode;
  /** `<dialog>` 요소에 추가할 Tailwind 클래스 */
  className?: string;
  /** 바깥(backdrop) 클릭 또는 ESC 키 입력 시 호출되는 콜백. 닫힘 애니메이션 후 실행됩니다. */
  onClose?: () => void;
}

const dialogClassName = cn(
  'fixed inset-x-[10px] bottom-[10px] top-auto',
  'm-0 w-auto max-w-none rounded-[28px] border-none outline-none',
  'bg-gray-50 pt-[16px] pb-[22px]',
  'shadow-[0_-12px_48px_0_rgba(0,0,0,0.16)]',
  'translate-y-full transition-transform duration-300 ease-out',
  'backdrop:bg-black-alpha-30 backdrop:opacity-0 backdrop:transition-opacity backdrop:duration-300',
);

/**
 * 네이티브 `<dialog>` 요소 기반의 베이스 BottomSheet.
 * 마운트 시 자동으로 `showModal()`을 호출해 표시되며, ESC 키 또는 바깥 클릭으로 닫힙니다.
 * 본문은 `children`, 하단 액션 영역은 `footer`로 자유롭게 구성할 수 있습니다.
 */
const BottomSheet = ({ children, footer, className, onClose }: BottomSheetProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = () => {
    if (!onClose) return;
    setIsVisible(false);
    window.setTimeout(onClose, ANIMATION_DURATION_MS);
  };

  /** dialog 본체가 target인 클릭만 backdrop 클릭으로 간주합니다. */
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop 클릭 대체 키보드 동작은 ESC(onCancel)로 처리합니다.
    <dialog
      ref={dialogRef}
      aria-modal='true'
      className={cn(dialogClassName, isVisible && 'translate-y-0 backdrop:opacity-100', className)}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className='flex flex-col h-[363px]'>
        <div className='flex justify-center pb-20'>
          <span aria-hidden='true' className='h-1 w-10 rounded-full bg-gray-200' />
        </div>
        <div className='px-5'>{children}</div>
        {footer && <footer className='px-5 pt-[34px]'>{footer}</footer>}
      </div>
    </dialog>
  );
};

export default BottomSheet;
