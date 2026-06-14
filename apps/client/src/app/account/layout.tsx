import Callout from '@/components/Callout/Callout';
import Header from '@/components/Header/Header';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col h-dvh pb-16'>
      <Header type='title' title='계좌 정보 입력' />
      <main className='flex flex-1 flex-col min-h-0 px-16 pt-8 gap-24'>
        <Callout
          title='계좌 정보 안내'
          size='small'
          hasBullet={false}
          subTexts={[
            '입력하신 계좌 정보는 리워드 지급 목적으로만 사용됩니다.',
            '예금주명은 계좌 실명과 동일하게 입력해 주세요.',
            '계좌번호 오입력으로 인한 지급 실패 시 리워드 지급이 지연될 수 있습니다.',
          ]}
        />

        {children}
      </main>
    </div>
  );
};

export default layout;
