import { type ButtonHTMLAttributes, type MouseEvent, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children' | 'onChange'> {
  /** 켜짐/꺼짐 상태 (제어). 생략하면 내부 상태로 동작합니다. */
  checked?: boolean;
  /** uncontrolled 초기값. */
  defaultChecked?: boolean;
  /** 상태 변경 콜백. */
  onChange?: (checked: boolean) => void;
  /** 외부에서 주입할 Tailwind 클래스. 최종 override 지점입니다. */
  className?: string;
}

// 트랙 40 × 24, 핸들 18, 좌우 여백 3 → on 이동거리 = 40 - 18 - 3*2 = 16px
// 디자인 토큰에 spacing-40/24/18이 없어 임의값(px) 사용.
const TRACK_CLASS =
  'relative inline-flex h-[24px] w-[40px] shrink-0 items-center rounded-full transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const HANDLE_CLASS =
  'pointer-events-none absolute left-[3px] h-[18px] w-[18px] rounded-full bg-white ' +
  'shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] transition-transform';

/**
 * 켜짐/꺼짐 상태를 표현하는 스위치 컴포넌트.
 *
 * `role="switch"`로 의미를 부여하며, 행/카드 등 외부 클릭 영역과 독립적으로 동작합니다.
 * 연결할 라벨이 필요하면 부모에서 `aria-labelledby` 또는 `aria-label`을 전달하세요.
 *
 * `checked`를 주면 controlled, 생략하면 `defaultChecked`로 시작하는 uncontrolled로 동작합니다.
 */
const Toggle = ({
  checked,
  defaultChecked = false,
  onChange,
  className,
  disabled,
  onClick,
  ...props
}: ToggleProps) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <button
      type='button'
      role='switch'
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        TRACK_CLASS,
        isChecked ? 'bg-brand-500' : 'bg-gray-200',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
      {...props}
    >
      <span className={cn(HANDLE_CLASS, isChecked && 'translate-x-[16px]')} />
    </button>
  );
};

export default Toggle;
