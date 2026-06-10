'use client';

import Image from 'next/image';
import Button from '@/components/Button/Button';

const AccountRegisterCard = () => {
  return (
    <section className='flex flex-col pt-20 px-20 pb-24 rounded-20 bg-white'>
      <header className='flex flex-col gap-8'>
        <h2 className='title-xsmall text-gray-900'>리워드, 어디로 보내드릴까요?</h2>
        <p className='body-small text-gray-500'>
          리워드를 보내드릴 계좌 정보를 입력해주세요.
          <br />
          5초면 충분해요.
        </p>
      </header>

      <div className='flex justify-center mb-[10px]'>
        <Image src='/bank.png' alt='계좌 등록' width={262} height={178} priority />
      </div>

      <Button theme='brand' size='medium' onClick={() => {}}>
        입력하기
      </Button>
    </section>
  );
};

export default AccountRegisterCard;
