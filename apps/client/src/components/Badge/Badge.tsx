import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeType = 'default' | 'brand' | 'warning' | 'success' | 'danger';

interface BadgeProps extends PropsWithChildren {
  /**
   * 배지 색상 톤. 의미(기본/브랜드/경고/성공/위험)에 따라 선택합니다.
   * @default 'default'
   */
  type?: BadgeType;
  /** 라벨 앞에 표시할 노드(보통 아이콘). 색상은 배지의 `text-*`를 상속합니다. */
  leftAddon?: ReactNode;
  /** 라벨 뒤에 표시할 노드(보통 아이콘). 색상은 배지의 `text-*`를 상속합니다. */
  rightAddon?: ReactNode;
  /** 외부에서 주입할 Tailwind 클래스. 최종 override 지점입니다. */
  className?: string;
}

const TYPE_CLASSES: Record<BadgeType, string> = {
  default: 'bg-black-alpha-5 text-gray-500',
  brand: 'bg-brand-alpha-10 text-brand',
  warning: 'bg-yellow-alpha-10 text-yellow-700',
  success: 'bg-blue-alpha-10 text-blue-500',
  danger: 'bg-red-alpha-10 text-red-500',
};

/**
 * 상태나 분류를 짧은 라벨로 표시하는 배지 컴포넌트.
 *
 * `type`으로 색상 톤을 바꾸고, 선택적으로 `leftAddon` / `rightAddon`으로
 * 라벨 양옆에 아이콘 같은 보조 노드를 함께 표시할 수 있습니다.
 */
const Badge = ({ type = 'default', leftAddon, rightAddon, children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex px-[6px] py-1 rounded-8 gap-[2px] items-center label-xsmall',
        TYPE_CLASSES[type],
        className,
      )}
    >
      {leftAddon}
      {children}
      {rightAddon}
    </span>
  );
};

export default Badge;
