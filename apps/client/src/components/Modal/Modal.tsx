'use client';

import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';

export interface ModalProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const Modal = ({ title, description, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const titleId = useId();
  const descriptionId = useId();

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
      className='fixed left-1/2 top-1/2 m-0 w-[calc(100%-32px)] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-none bg-gray-50 p-[22px] shadow-[0_24px_64px_0_rgba(0,0,0,0.24)] outline-none backdrop:bg-gray-30-alpha'
      onCancel={(event) => event.preventDefault()}
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <span id={titleId} className='title-small text-gray-950'>
            {title}
          </span>
          <span id={descriptionId} className='subtext-large whitespace-pre-line text-gray-600'>
            {description}
          </span>
        </div>
        <div className='flex items-center justify-center gap-2'>{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
