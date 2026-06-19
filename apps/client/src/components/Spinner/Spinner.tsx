import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** 지름(px). */
  size?: number;
  /** 외부에서 주입할 Tailwind 클래스. */
  className?: string;
  /** 스크린리더에 읽어줄 라벨. */
  label?: string;
}

/**
 * 데이터 모양이 정해지지 않은 대기 상태에 쓰는 회전형 로딩 인디케이터.
 *
 * 콘텐츠 자리표시가 필요한 경우엔 `Skeleton`을 사용합니다.
 */
const Spinner = ({ size = 24, className, label = '로딩 중' }: SpinnerProps) => {
  return (
    <span
      role='status'
      aria-label={label}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 10)) }}
      className={cn(
        'inline-block animate-spin rounded-full border-gray-200 border-t-gray-900',
        className,
      )}
    />
  );
};

export default Spinner;
