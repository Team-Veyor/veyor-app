'use client';

import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import List from '@/components/List/List';

// TODO: 링크 수정
const 개인정보수집및이용약관 = 'https://www.naver.com';
const 서비스이용약관 = 'https://www.naver.com';
const 개인정보처리방침 = 'https://www.naver.com';

const TermsPage = () => {
  return (
    <div className='flex flex-col px-16 pt-8'>
      <List>
        <List.Item onClick={() => window.open(개인정보수집및이용약관, '_blank')}>
          <List.Item.Content title='개인정보 수집 및 이용 약관' />
          <List.Item.Trailing>
            <ChevronDownIcon />
          </List.Item.Trailing>
        </List.Item>
        <List.Item onClick={() => window.open(서비스이용약관, '_blank')}>
          <List.Item.Content title='서비스 이용 약관' />
          <List.Item.Trailing>
            <ChevronDownIcon />
          </List.Item.Trailing>
        </List.Item>
        <List.Item onClick={() => window.open(개인정보처리방침, '_blank')}>
          <List.Item.Content title='개인정보처리방침' />
          <List.Item.Trailing>
            <ChevronDownIcon />
          </List.Item.Trailing>
        </List.Item>
      </List>
    </div>
  );
};

export default TermsPage;
