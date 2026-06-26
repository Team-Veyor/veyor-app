'use client';

import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import { cn } from '@/lib/utils';

const ANIMATION_DURATION_MS = 300;
const DRAG_CLOSE_THRESHOLD_PX = 80;

export interface BottomSheetProps {
  /** 시트 본문에 렌더링할 노드 */
  children?: ReactNode;
  /** 핸들 아래에 고정으로 표시할 상단 영역(보통 제목). `scrollBody`와 함께 쓰면 스크롤되지 않습니다. */
  header?: ReactNode;
  /** 하단 액션 영역(보통 버튼). 지정하지 않으면 영역이 표시되지 않습니다. */
  footer?: ReactNode;
  /** `<dialog>` 요소에 추가할 Tailwind 클래스 */
  className?: string;
  /**
   * 본문(children)만 스크롤하고 핸들·footer는 고정할지 여부.
   * `max-height`를 지정한 긴 콘텐츠에서 제목/하단 버튼을 고정하고 싶을 때 사용합니다.
   * @default false
   */
  scrollBody?: boolean;
  /** 바깥(backdrop) 클릭 또는 ESC 키 입력 시 호출되는 콜백. 닫힘 애니메이션 후 실행됩니다. */
  onClose?: () => void;
}

const HIDE_SCROLLBAR =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const dialogClassName = cn(
  'fixed bottom-[10px] top-auto left-[max(10px,calc((100vw-640px)/2+10px))] right-[max(10px,calc((100vw-640px)/2+10px))]',
  'm-0 w-auto max-w-none rounded-[28px] border-none outline-none',
  'bg-white pt-[16px] pb-[22px]',
  HIDE_SCROLLBAR,
  'shadow-[0_-12px_48px_0_rgba(0,0,0,0.16)]',
  'translate-y-full transition-transform duration-300 ease-out',
  'backdrop:bg-black-alpha-30 backdrop:opacity-0 backdrop:transition-opacity backdrop:duration-300',
);

/**
 * 네이티브 `<dialog>` 요소 기반의 베이스 BottomSheet.
 * 마운트 시 자동으로 `showModal()`을 호출해 표시되며, ESC 키 또는 바깥 클릭으로 닫힙니다.
 * 본문은 `children`, 하단 액션 영역은 `footer`로 자유롭게 구성할 수 있습니다.
 */
const BottomSheet = ({
  children,
  header,
  footer,
  className,
  scrollBody = false,
  onClose,
}: BottomSheetProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  useBodyScrollLock();

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

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (!onClose) return;
    dragStartYRef.current = event.clientY;
    dragOffsetRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null) return;

    const nextDragOffset = Math.max(0, event.clientY - dragStartYRef.current);
    dragOffsetRef.current = nextDragOffset;
    setDragOffset(nextDragOffset);
  };

  const handleDragEnd = () => {
    if (dragStartYRef.current === null) return;

    const shouldClose = dragOffsetRef.current >= DRAG_CLOSE_THRESHOLD_PX;
    dragStartYRef.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);

    if (shouldClose) handleClose();
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
      className={cn(
        dialogClassName,
        scrollBody
          ? 'flex h-[calc(100dvh-20px)] max-h-[calc(100dvh-20px)] flex-col overflow-hidden'
          : 'max-h-[calc(100dvh-20px)] overflow-y-auto',
        isVisible && 'translate-y-0 backdrop:opacity-100',
        dragOffset > 0 && 'transition-none',
        className,
      )}
      style={dragOffset > 0 ? { transform: `translateY(${dragOffset}px)` } : undefined}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className={cn('flex flex-col', scrollBody && 'min-h-0 flex-1')}>
        <div
          className='shrink-0 touch-none cursor-grab active:cursor-grabbing'
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className='flex justify-center pb-20'>
            <span aria-hidden='true' className='h-1 w-10 rounded-full bg-gray-200' />
          </div>
          {header && <div className='px-5'>{header}</div>}
        </div>
        <div
          className={cn('px-5', scrollBody && cn('min-h-0 flex-1 overflow-y-auto', HIDE_SCROLLBAR))}
        >
          {children}
        </div>
        {footer && <footer className='mt-auto shrink-0 px-5 pt-[34px]'>{footer}</footer>}
      </div>
    </dialog>
  );
};

export default BottomSheet;
