'use client';

import { useRouter } from 'next/navigation';
import type { MenuItem } from '../types/menu';

// TODO: 채팅 상담 링크 확정되면 교체
const CHAT_SUPPORT_URL = '#';

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
      onSelect: () => window.open(CHAT_SUPPORT_URL, '_blank', 'noopener,noreferrer'),
    },
  ];

  const account: MenuItem[] = [
    { label: '계좌 정보 관리', onSelect: () => router.push('/user/account') },
    { label: '참여 내역', onSelect: () => router.push('/participations') },
  ];

  const policy: MenuItem[] = [
    { label: '서비스 이용 동의', onSelect: () => router.push('/user/consents') },
    { label: '이용 약관', onSelect: () => router.push('/terms/terms') },
    { label: '오픈소스 라이선스', onSelect: () => router.push('/terms/open-source') },
  ];

  const session: MenuItem[] = [
    { label: '로그아웃', onSelect: onLogout },
    { label: '탈퇴하기', onSelect: onWithdraw },
  ];

  return [support, account, policy, session];
};
