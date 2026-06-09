import InfoCircleIcon from '@/assets/icons/InfoCircleIcon';
import { cn } from '@/lib/utils';
import type { Size } from '@/types/types';

type CalloutType = 'default' | 'brand' | 'warning' | 'success' | 'danger';
type CalloutSize = Extract<Size, 'small' | 'large'>;

interface CalloutProps {
  /** Callout의 시각적 톤. `default`는 회색, `brand`는 브랜드 색상, `success`/`warning`/`danger`는 상태 색상을 사용합니다. */
  type?: CalloutType;
  /** Callout 크기. `small`은 패딩과 타이포가 작고, `large`는 더 큰 패딩과 타이포를 사용합니다. */
  size?: CalloutSize;
  /** 상단 제목 텍스트 */
  title: string;
  /** 하단 불릿 리스트로 표시되는 서브 텍스트 배열. 비어있거나 생략하면 리스트가 렌더링되지 않습니다. */
  subTexts?: string[];
  /** 외부에서 주입할 추가 클래스 */
  className?: string;
}

const TYPE_CLASSES: Record<CalloutType, string> = {
  default: 'bg-gray-5-alpha text-gray-600',
  brand: 'bg-brand-alpha-10 text-brand',
  success: 'bg-blue-alpha-10 text-success',
  warning: 'bg-yellow-alpha-10 text-warning',
  danger: 'bg-red-alpha-10 text-danger',
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
  type = 'default',
  size = 'large',
  title,
  subTexts,
  className,
}: CalloutProps) => {
  const titleClass = SIZE_CLASSES[size];

  return (
    <div
      className={cn(
        'flex flex-col w-full gap-[4px] rounded-[16px] py-[12px] px-[16px]',
        'shadow-[0_0_80px_0_rgba(0,0,0,0.05)]',
        TYPE_CLASSES[type],
        className,
      )}
    >
      <div className='flex items-center gap-[6px]'>
        <span className='inline-flex size-[24px] items-center justify-center rounded-[8px] bg-white'>
          <InfoCircleIcon className='size-4' />
        </span>
        <span className={titleClass}>{title}</span>
      </div>

      {subTexts && subTexts.length > 0 && (
        <ul className={cn('flex flex-col list-disc pl-[32px] gap-[4px] subtext-small')}>
          {subTexts.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Callout;
