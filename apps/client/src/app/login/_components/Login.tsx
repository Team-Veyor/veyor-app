'use client';

import { useState } from 'react';
import useKakaoMutation from '@/app/login/_hooks/useKakaoMutation';
import KakaoIcon from '@/assets/icons/KakaoIcon';
import LoginLogo from '@/assets/icons/LoginLogo';
import LogoIcon from '@/assets/icons/LogoIcon';
import Button from '@/components/Button/Button';

const Login = () => {
  // 버튼 클릭 시 로딩 상태를 위해 별도의 상태 추가
  const [isKakaoStarting, setIsKakaoStarting] = useState(false);

  const { mutate: loginWithKakao, isPending: isLoadingKakao } = useKakaoMutation();
  const isKakaoButtonLoading = isLoadingKakao || isKakaoStarting;

  const handleKakaoClick = () => {
    if (isKakaoButtonLoading) return;

    setIsKakaoStarting(true);

    loginWithKakao(undefined, {
      onError: () => setIsKakaoStarting(false),
    });
  };

  return (
    <main className='flex h-dvh items-center justify-center bg-gray-50'>
      <section className='flex w-full max-w-sm flex-col gap-16 h-full pb-32 pt-[84px]'>
        <div className='flex flex-col items-center gap-1'>
          <LogoIcon className='text-gray-900' />
          <p className='title-xsmall-weak text-gray-500'>백일 설문 기록</p>
        </div>
        <LoginLogo className='flex py-[111px] px-[85px] box-content shrink-0' />
        <div className='flex flex-col mt-auto px-16'>
          <Button
            variant='secondary'
            theme='light'
            className='gap-2 bg-[#FEE500] text-[rgba(0, 0, 0, 0.85)'
            disabled={isKakaoButtonLoading}
            size='large'
            isLoading={isKakaoButtonLoading}
            onClick={handleKakaoClick}
          >
            <KakaoIcon />
            카카오로 시작하기
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Login;
