'use client';

import useKakaoMutation from '@/app/login/_hooks/useKakaoMutation';
import KakaoIcon from '@/assets/icons/KakaoIcon';
import LogoIcon from '@/assets/icons/LogoIcon';
import Button from '@/components/Button/Button';

export default function LoginPage() {
  // TODO: 에러 시 토스트
  const { mutate: loginWithKakao, isPending: isLoadingKakao } = useKakaoMutation();

  return (
    <main className='flex h-dvh items-center justify-center bg-gray-50'>
      <section className='flex w-full max-w-sm flex-col gap-10 h-full pb-[32px] pt-[84px]'>
        <div className='flex flex-col items-center gap-1'>
          <LogoIcon />
          <p className='title-xsmall-weak text-gray-500'>백일 설문 기록</p>
        </div>

        <div className='flex flex-col mt-auto px-[16px]'>
          <Button
            theme='gray'
            className='gap-2 bg-[#FEE500] text-[rgba(0, 0, 0, 0.85)'
            disabled={isLoadingKakao}
            size='large'
            onClick={() => loginWithKakao()}
          >
            <KakaoIcon />

            {/* TODO: 로딩 상태 표시 */}
            {isLoadingKakao ? '카카오로 이동 중...' : '카카오로 계속하기'}
          </Button>
        </div>
      </section>
    </main>
  );
}
