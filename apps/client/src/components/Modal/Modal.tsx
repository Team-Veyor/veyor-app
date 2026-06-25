'use client';

import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import { cn } from '@/lib/utils';

export interface ModalProps {
  /** 모달 상단에 표시되는 제목 텍스트 */
  title: string;
  /** 제목 아래에 표시되는 설명 텍스트. 줄바꿈(`\n`)을 포함할 수 있습니다. */
  description: string;
  /** 모달 하단 액션 영역에 렌더링할 노드 (보통 버튼 그룹) */
  children?: ReactNode;
  /** `<dialog>` 요소에 추가할 Tailwind 클래스 */
  className?: string;
}

/**
 * 네이티브 `<dialog>` 요소 기반의 베이스 모달.
 * 마운트 시 자동으로 `showModal()`을 호출해 표시되며, ESC로 닫히지 않습니다.
 * 하단 액션 영역은 `children`으로 자유롭게 구성할 수 있습니다.
 */
const Modal = ({ title, description, children, className }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  useBodyScrollLock();

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal='true'
      className={cn(
        'fixed left-1/2 top-1/2 m-0 w-[311px] -translate-x-1/2 -translate-y-1/2 rounded-24 border-none bg-gray-50 pt-[22px] pb-16 shadow-[0_24px_64px_0_rgba(0,0,0,0.24)] outline-none backdrop:bg-black-alpha-30',
        className,
      )}
      onCancel={(event) => event.preventDefault()}
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2 px-20'>
          <span id={titleId} className='title-small text-gray-900'>
            {title}
          </span>
          <span id={descriptionId} className='subtext-large whitespace-pre-line text-gray-500'>
            {description}
          </span>
        </div>
        <div className='flex items-center justify-center gap-8 px-16'>{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
