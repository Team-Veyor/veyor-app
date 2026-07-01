'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@/assets/icons/HomeIcon';
import UserIcon from '@/assets/icons/UserIcon';
import { getAmplitudeTab, trackAmplitudeEvent } from '@/lib/amplitude';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/home', label: '홈', Icon: HomeIcon, match: ['/home'] },
  { href: '/user', label: '내 정보', Icon: UserIcon, match: ['/user', '/policy'] },
];

interface NavigationProps {
  /** false면 하단 flex 흐름에 배치 (고정 해제). 기본값 true. */
  fixed?: boolean;
}

/**
 * 화면 하단에 고정되는 바텀 네비게이션.
 *
 * 현재 경로(`usePathname`)와 각 아이템의 `match` 경로들을 prefix 매칭해
 * 활성 아이템을 강조합니다. (예: '내 정보'는 `/user`, `/policy` 하위 모두 포함)
 */
const Navigation = ({ fixed = true }: NavigationProps) => {
  const pathname = usePathname();
  const currentTab = getAmplitudeTab(pathname);
  const currentItem = ITEMS.find(({ match }) =>
    match.some((path) => pathname === path || pathname.startsWith(`${path}/`)),
  );

  return (
    <nav
      aria-label='하단 네비게이션'
      className={cn(
        fixed && 'fixed bottom-0 left-1/2 w-full max-w-[640px] -translate-x-1/2',
        !fixed && 'w-full shrink-0',
        'flex items-center justify-around',
        'rounded-t-24 bg-white px-[18px] pt-8 pb-32',
        'shadow-[0_0_80px_0_var(--color-black-alpha-5)]',
      )}
    >
      {ITEMS.map(({ href, label, Icon, match }) => {
        const active = match.some((path) => pathname === path || pathname.startsWith(`${path}/`));

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              if (currentItem?.href === href) return;

              trackAmplitudeEvent('navigation_changed', {
                from_tab: currentTab,
                to_tab: href === '/home' ? 'home' : 'mypage',
              });
            }}
            className={cn(
              'flex flex-1 flex-col items-center gap-4 py-4',
              'subtext-small transition-colors',
              active ? 'text-gray-950' : 'text-gray-500',
            )}
          >
            <Icon className='size-24' />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
