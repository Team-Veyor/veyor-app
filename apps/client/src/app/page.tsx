'use client';

import { useState } from 'react';
import AgreementBottomSheet from '@/components/BottomSheet/AgreementBottomSheet';
import Button from '@/components/Button/Button';

export default function Home() {
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  return (
    <main className='flex min-h-dvh items-end justify-center bg-[#B3B3B3] p-5'>
      <div className='w-full max-w-sm'>
        <Button variant='primary' size='large' onClick={() => setIsAgreementOpen(true)}>
          약관 동의 열기
        </Button>
      </div>

      {isAgreementOpen && (
        <AgreementBottomSheet
          items={[
            { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
            { id: 'service', label: '백설기 서비스 이용 약관 동의', required: true },
            { id: 'marketing', label: '마케팅 수신 동의', required: false },
          ]}
          onSubmit={(agreedIds) => {
            // biome-ignore lint/suspicious/noConsole: 데모 페이지 동작 확인용
            console.log('agreed:', agreedIds);
            setIsAgreementOpen(false);
          }}
          onItemExpand={(id) => {
            // biome-ignore lint/suspicious/noConsole: 데모 페이지 동작 확인용
            console.log('expand:', id);
          }}
          onClose={() => setIsAgreementOpen(false)}
        />
      )}
    </main>
  );
}
