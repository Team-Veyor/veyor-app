import type { ReactNode } from 'react';
import InfoCircleIcon from '@/assets/icons/InfoCircleIcon';
import { cn } from '@/lib/utils';
import type { Size } from '@/types/types';

type CalloutType = 'default' | 'brand' | 'warning' | 'success' | 'danger';
type CalloutSize = Extract<Size, 'small' | 'large'>;

interface CalloutProps {
  /** Callout의 아이콘. `info`는 정보 아이콘, `brand`는 브랜드 아이콘, `success`는 성공 아이콘, `warning`는 경고 아이콘, `danger`는 위험 아이콘을 사용합니다. */
  icon?: ReactNode;
  /** Callout의 시각적 톤. `default`는 회색, `brand`는 브랜드 색상, `success`/`warning`/`danger`는 상태 색상을 사용합니다. */
  type?: CalloutType;
  /** Callout 크기. `small`은 패딩과 타이포가 작고, `large`는 더 큰 패딩과 타이포를 사용합니다. */
  size?: CalloutSize;
  /** 상단 제목 텍스트 */
  title: string;
  /** 하단 리스트로 표시되는 서브 텍스트 배열. 비어있거나 생략하면 리스트가 렌더링되지 않습니다. */
  subTexts?: string[];
  /** 서브 텍스트에 불릿(`list-disc`)을 표시할지 여부. 기본값 `true`. */
  hasBullet?: boolean;
  /** 외부에서 주입할 추가 클래스 */
  className?: string;
}

const TYPE_CLASSES: Record<CalloutType, string> = {
  default: 'bg-black-alpha-5 text-gray-600',
  brand: 'bg-surface-brand text-brand',
  success: 'bg-surface-success text-success',
  warning: 'bg-surface-warning text-warning',
  danger: 'bg-surface-danger text-danger',
};

const SIZE_CLASSES: Record<CalloutSize, string> = {
  small: 'label-xsmall',
  large: 'label-medium',
};

/**
 * 알림/안내용 Callout 컴포넌트.
 * type으로 톤을, size로 패딩·타이포 스케일을 제어합니다.
 */
const Callout = ({
  icon = <InfoCircleIcon className='size-16' />,
  type = 'default',
  size = 'large',
  title,
  subTexts,
  hasBullet = true,
  className,
}: CalloutProps) => {
  const titleClass = SIZE_CLASSES[size];

  return (
    <div
      className={cn(
        'flex flex-col w-full gap-4 rounded-16 p-3',
        'shadow-[0_0_80px_0_rgba(0,0,0,0.05)]',
        TYPE_CLASSES[type],
        className,
      )}
    >
      <div className='flex items-center gap-[6px]'>
        <span className='inline-flex size-6 items-center justify-center rounded-8 bg-white-alpha-60'>
          {icon}
        </span>
        <span className={titleClass}>{title}</span>
      </div>

      {subTexts && subTexts.length > 0 && (
        <ul
          className={cn(
            'flex flex-col gap-4 pl-32 subtext-small',
            hasBullet ? 'list-disc' : 'list-none whitespace-pre-line',
          )}
        >
          {subTexts.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Callout;
