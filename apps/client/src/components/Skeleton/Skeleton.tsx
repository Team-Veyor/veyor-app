import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type SkeletonShape = 'rect' | 'circle';

interface SkeletonProps {
  /**
   * 스켈레톤 모양. `rect`는 텍스트·카드 영역, `circle`은 아바타·아이콘 자리에 사용합니다.
   * @default 'rect'
   */
  shape?: SkeletonShape;
  /** 너비. 숫자는 px, 문자열은 그대로 적용됩니다(예: `'100%'`). */
  width?: number | string;
  /** 높이. 숫자는 px, 문자열은 그대로 적용됩니다. */
  height?: number | string;
  /** 외부에서 주입할 Tailwind 클래스. radius·여백 등 최종 override 지점입니다. */
  className?: string;
}

const SHAPE_CLASSES: Record<SkeletonShape, string> = {
  rect: 'rounded-8',
  circle: 'rounded-full',
};

const toSize = (value?: number | string) => (typeof value === 'number' ? `${value}px` : value);

/**
 * 콘텐츠 로딩 중 자리표시자로 쓰는 스켈레톤 블록.
 *
 * `shape`로 사각형/원형을 고르고 `width`·`height`로 크기를 정합니다.
 * 여러 개를 조합해 화면 단위의 로딩 레이아웃을 구성합니다.
 */
const Skeleton = ({ shape = 'rect', width, height, className }: SkeletonProps) => {
  const style: CSSProperties = {
    width: toSize(width),
    height: toSize(height),
  };

  return (
    <span
      aria-hidden='true'
      style={style}
      className={cn('block skeleton-shimmer', SHAPE_CLASSES[shape], className)}
    />
  );
};

export default Skeleton;
