'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface BottomSheetProps {
  /** 시트 본문에 렌더링할 노드 */
  children?: ReactNode;
  /** 하단 액션 영역(보통 버튼). 지정하지 않으면 영역이 표시되지 않습니다. */
  footer?: ReactNode;
  /** `<dialog>` 요소에 추가할 Tailwind 클래스 */
  className?: string;
}

/**
 * 네이티브 `<dialog>` 요소 기반의 베이스 BottomSheet.
 * 마운트 시 자동으로 `showModal()`을 호출해 표시되며, ESC로 닫히지 않습니다.
 * 본문은 `children`, 하단 액션 영역은 `footer`로 자유롭게 구성할 수 있습니다.
 */
const BottomSheet = ({ children, footer, className }: BottomSheetProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-modal='true'
      className={cn(
        'fixed left-[10px] right-[10px] top-auto bottom-[10px] m-0 w-auto max-w-none rounded-[28px] border-none bg-gray-50 pt-[16px] pb-[22px] shadow-[0_-12px_48px_0_rgba(0,0,0,0.16)] outline-none backdrop:bg-gray-30-alpha',
        className,
      )}
      onCancel={(event) => event.preventDefault()}
    >
      <div className='flex flex-col'>
        <div className='flex justify-center pb-[20px]'>
          <span aria-hidden='true' className='h-1 w-10 rounded-full bg-gray-200' />
        </div>
        <div className='px-5'>{children}</div>
        {footer && <footer className='px-5 pt-[34px]'>{footer}</footer>}
      </div>
    </dialog>
  );
};

export default BottomSheet;
