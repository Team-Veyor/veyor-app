import type { Metadata } from 'next';
import { OPEN_SOURCE_LICENSES } from '../_constants/licenses';

export const metadata: Metadata = {
  title: '오픈소스 라이선스',
};

const OpenSourcePage = () => {
  return (
    <div className='flex flex-col px-24 pt-16 pb-[120px] gap-20'>
      {OPEN_SOURCE_LICENSES.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target='_blank'
          rel='noopener noreferrer'
          className='flex flex-1 items-center justify-between border-b border-gray-100'
        >
          <span className='flex flex-col items-start gap-4'>
            <p className='label-medium text-gray-900'>{item.name}</p>
            <p className='subtext-medium text-gray-500'>{item.href}</p>
          </span>
        </a>
      ))}
    </div>
  );
};

export default OpenSourcePage;
