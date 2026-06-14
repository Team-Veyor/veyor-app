'use client';

import {
  type ButtonHTMLAttributes,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import MoreIcon from '@/assets/icons/MoreIcon';
import { cn } from '@/lib/utils';

const MenuContext = createContext<{ close: () => void } | null>(null);

interface MenuProps {
  /** 메뉴에 표시할 `Menu.Item` 항목들 */
  children: ReactNode;
  /** 트리거 버튼 대신 사용할 커스텀 노드. 생략하면 케밥(점 3개) 아이콘이 표시됩니다. */
  trigger?: ReactNode;
  /** 열림 상태 (제어 모드). 생략하면 내부 상태로 동작합니다. */
  open?: boolean;
  /** 열림 상태가 바뀔 때 호출됩니다. */
  onOpenChange?: (open: boolean) => void;
  /** 팝오버 정렬 방향 */
  align?: 'left' | 'right';
  /** 트리거에 적용할 `aria-label` */
  label?: string;
  /** 외곽 래퍼에 적용할 Tailwind 클래스 */
  className?: string;
  /** 팝오버 패널에 적용할 Tailwind 클래스 */
  panelClassName?: string;
}

interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * 케밥(점 3개) 트리거로 열리는 공통 팝오버 메뉴.
 * 트리거 클릭으로 열고, 바깥 클릭 또는 ESC로 닫힙니다.
 * `open`을 주면 controlled, 생략하면 내부 상태로 동작합니다.
 */
const Menu = ({
  children,
  trigger,
  open,
  onOpenChange,
  align = 'right',
  label = '메뉴 열기',
  className,
  panelClassName,
}: MenuProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <button
        type='button'
        aria-label={label}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setOpen(!isOpen)}
        className='inline-flex items-center justify-center rounded-8 text-gray-500 transition-colors hover:text-gray-700'
      >
        {trigger ?? <MoreIcon className='size-24' />}
      </button>

      {isOpen && (
        <MenuContext.Provider value={{ close: () => setOpen(false) }}>
          <div
            id={panelId}
            role='menu'
            className={cn(
              'absolute top-full z-10 mt-[8px] min-w-[200px]',
              'flex flex-col rounded-20 bg-white py-[8px]',
              'shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]',
              align === 'right' ? 'right-0' : 'left-0',
              panelClassName,
            )}
          >
            {children}
          </div>
        </MenuContext.Provider>
      )}
    </div>
  );
};

/**
 * 메뉴 항목 버튼. 클릭 시 `onClick`을 실행한 뒤 메뉴를 닫습니다.
 */
const MenuItem = ({ children, className, onClick, ...props }: MenuItemProps) => {
  const context = useContext(MenuContext);

  return (
    <button
      type='button'
      role='menuitem'
      onClick={(event) => {
        onClick?.(event);
        context?.close();
      }}
      className={cn(
        'label-medium w-full px-16 py-8 text-left text-gray-600',
        'transition-colors hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Menu.Item = MenuItem;

export default Menu;
