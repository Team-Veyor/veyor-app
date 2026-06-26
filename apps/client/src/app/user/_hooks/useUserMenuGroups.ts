'use client';

import { useRouter } from 'next/navigation';
import { trackAmplitudeEvent } from '@/lib/amplitude';
import type { MenuItem } from '../types/menu';

const CHAT_SUPPORT_URL = 'https://open.kakao.com/o/sMjP3qti';

interface UseUserMenuGroupsParams {
  onLogout: () => void;
  onWithdraw: () => void;
}

export const useUserMenuGroups = ({
  onLogout,
  onWithdraw,
}: UseUserMenuGroupsParams): MenuItem[][] => {
  const router = useRouter();

  const support: MenuItem[] = [
    {
      label: '채팅 상담 바로가기',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '채팅 상담 바로가기' });
        window.open(CHAT_SUPPORT_URL, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  const account: MenuItem[] = [
    {
      label: '계좌 정보 관리',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '계좌 정보 관리' });
        trackAmplitudeEvent('account_management_clicked', { entry_point: 'user' });
        router.push('/user/account');
      },
    },
    {
      label: '참여 내역',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '참여 내역' });
        trackAmplitudeEvent('participation_history_clicked', { entry_point: 'user' });
        router.push('/user/participations');
      },
    },
  ];

  const policy: MenuItem[] = [
    {
      label: '서비스 이용 동의',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '서비스 이용 동의' });
        router.push('/policy/consents');
      },
    },
    {
      label: '이용 약관',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '이용 약관' });
        router.push('/policy/terms');
      },
    },
    {
      label: '오픈소스 라이선스',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '오픈소스 라이선스' });
        router.push('/policy/open-source');
      },
    },
  ];

  const session: MenuItem[] = [
    {
      label: '로그아웃',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '로그아웃' });
        trackAmplitudeEvent('logout_clicked');
        onLogout();
      },
    },
    {
      label: '탈퇴하기',
      onSelect: () => {
        trackAmplitudeEvent('menu_clicked', { mypage_menu_name: '탈퇴하기' });
        trackAmplitudeEvent('leave_service_clicked');
        onWithdraw();
      },
    },
  ];

  return [support, account, policy, session];
};
