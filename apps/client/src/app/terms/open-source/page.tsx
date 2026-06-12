import type { Metadata } from 'next';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon';
import List from '@/components/List/List';
import { OPEN_SOURCE_LICENSES } from './_constants/licenses';

export const metadata: Metadata = {
  title: '오픈소스 라이선스',
};

const OpenSourcePage = () => {
  return (
    <>
      <p className='body-small text-gray-500'>
        Veyor는 아래의 오픈소스 소프트웨어를 사용하여 만들어졌습니다.
      </p>

      <List>
        {OPEN_SOURCE_LICENSES.map((item) => (
          <List.Item key={item.name}>
            <List.Item.Content>
              <a
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className='flex flex-1 items-center justify-between gap-12'
              >
                <span className='flex flex-col items-start gap-[2px]'>
                  <span className='label-medium text-gray-600'>{item.name}</span>
                  <span className='subtext-medium text-gray-500'>{item.license}</span>
                </span>
                <ChevronRightIcon className='shrink-0 text-gray-500' />
              </a>
            </List.Item.Content>
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default OpenSourcePage;
