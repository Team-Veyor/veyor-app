import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import ListItem from './ListItem';

interface ListProps extends HTMLAttributes<HTMLUListElement> {}

/**
 * 흰색 라운드 카드 안에 `List.Item`들을 세로로 묶는 그룹 컨테이너.
 * 항목 사이에는 얇은 구분선이 자동으로 들어갑니다.
 */
const List = ({ className, children, ...props }: ListProps) => {
  return (
    <ul
      className={cn(
        'flex flex-col rounded-20 bg-white px-20',
        'divide-y divide-gray-100',
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
};

List.Item = ListItem;

export default List;
