'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import WarningModal from '@/components/Modal/WarningModal';
import UserMenuList from './_components/UserMenuList';
import useLogoutMutation from './_hooks/useLogoutMutation';
import useMe from './_hooks/useMe';
import { useUserMenuGroups } from './_hooks/useUserMenuGroups';
import useWithdrawMutation from './_hooks/useWithdrawMutation';

const UserPage = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const router = useRouter();

  const { data: me } = useMe();
  const logoutMutation = useLogoutMutation();
  const withdrawMutation = useWithdrawMutation();

  const menuGroups = useUserMenuGroups({
    onLogout: () => setLogoutOpen(true),
    onWithdraw: () => setWithdrawOpen(true),
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLogoutOpen(false);
        router.replace('/login');
      },
    });
  };

  const handleWithdraw = () => {
    withdrawMutation.mutate(undefined, {
      onSuccess: () => {
        setWithdrawOpen(false);
        router.replace('/login');
      },
    });
  };

  return (
    <>
      <div className='flex items-baseline gap-8 px-8 py-4'>
        <span className='label-medium text-gray-900'>{me?.name}</span>
        <span className='body-small text-gray-500'>{me?.email}</span>
      </div>

      <div className='flex flex-col gap-12'>
        {menuGroups.map((group, index) => (
          <UserMenuList key={group[0]?.label ?? index} items={group} />
        ))}
      </div>

      {logoutOpen && (
        <ConfirmModal
          title='로그아웃 하시겠어요?'
          description={'현재 계정에서 로그아웃됩니다.\n언제든 다시 로그인할 수 있습니다.'}
          leftButtonText='취소'
          rightButtonText='로그아웃'
          rightButtonIsLoading={logoutMutation.isPending}
          onLeftButtonClick={() => setLogoutOpen(false)}
          onRightButtonClick={handleLogout}
        />
      )}

      {withdrawOpen && (
        <WarningModal
          title='정말 탈퇴하시겠어요?'
          description={'탈퇴하면 계정 정보와 활동 내역이 삭제되며\n복구할 수 없습니다.'}
          leftButtonText='취소'
          rightButtonText='탈퇴하기'
          rightButtonIsLoading={withdrawMutation.isPending}
          onLeftButtonClick={() => setWithdrawOpen(false)}
          onRightButtonClick={handleWithdraw}
        />
      )}
    </>
  );
};

export default UserPage;
