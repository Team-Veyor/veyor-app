import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ListItemProps extends PropsWithChildren {
  /** 행 전체 클릭 시 호출됩니다. 지정하면 내부 컨테이너가 `<button>`으로 렌더됩니다. */
  onClick?: () => void;
  /** 비활성 상태. `onClick`이 무시되고 시각적으로 흐려집니다. */
  disabled?: boolean;
  /** 외부에서 주입할 Tailwind 클래스. 최종 override 지점입니다. */
  className?: string;
}

/**
 * `List` 내부에 들어가는 한 행.
 *
 * 좌/중/우 슬롯은 sub-component(`List.Item.Leading`, `List.Item.Content`,
 * `List.Item.Trailing`)로 조립합니다. `Trailing`은 children에 ReactNode 여러 개를
 * 자유롭게 넣을 수 있어 Badge·Toggle·텍스트·아이콘 등을 조합할 수 있습니다.
 */
const ListItem = ({ onClick, disabled, className, children }: ListItemProps) => {
  const clickable = Boolean(onClick) && !disabled;

  const rowClassName = cn(
    'flex w-full items-center gap-12 py-12 text-left',
    clickable && 'cursor-pointer',
    className,
  );

  return (
    <li className={cn(disabled && 'opacity-40')}>
      {clickable ? (
        <button type='button' className={rowClassName} onClick={onClick} disabled={disabled}>
          {children}
        </button>
      ) : (
        <div className={rowClassName}>{children}</div>
      )}
    </li>
  );
};

/** 행 좌측 슬롯 (아이콘/아바타 등). */
const Leading = ({ children }: PropsWithChildren) => {
  return <span className='flex shrink-0 items-center'>{children}</span>;
};

interface ContentProps {
  /** 행의 주요 텍스트. children 미사용 시 표시됩니다. */
  title?: string;
  /** 보조 설명 텍스트. `title`과 함께 쓸 때만 노출됩니다. */
  subtext?: string;
  /** 커스텀 내용. 지정 시 `title`/`subtext`보다 우선합니다. */
  children?: ReactNode;
}

/**
 * 행 중앙 슬롯. 가용 너비를 모두 차지합니다.
 * `title`(+`subtext`) prop 형태 또는 children 형태로 사용할 수 있습니다.
 */
const Content = ({ title, subtext, children }: ContentProps) => {
  return (
    <span className='flex flex-1 flex-col items-start'>
      {children ?? (
        <div className='flex flex-col items-start gap-[2px]'>
          {title && <span className='label-medium text-text-secondary'>{title}</span>}
          {subtext && <span className='subtext-medium text-text-tertiary'>{subtext}</span>}
        </div>
      )}
    </span>
  );
};

/**
 * 행 우측 슬롯. children으로 받은 요소를 가로로 나열하며 자동으로 간격을 둡니다.
 * Badge, Toggle, 텍스트, chevron 등 자유롭게 조합할 수 있습니다.
 */
const Trailing = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <span className={cn('flex shrink-0 items-center gap-12 text-gray-500', className)}>
      {children}
    </span>
  );
};

ListItem.Leading = Leading;
ListItem.Content = Content;
ListItem.Trailing = Trailing;

export default ListItem;
