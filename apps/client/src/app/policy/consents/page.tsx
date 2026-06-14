'use client';

import useConsents from '@/app/policy/_hooks/useConsents';
import useMarketing from '@/app/policy/_hooks/useMarketing';
import List from '@/components/List/List';
import Toggle from '@/components/Toggle/Toggle';

const ConsentsPage = () => {
  const { data: consents } = useConsents();
  const { mutate: patchMarketing } = useMarketing();

  const marketing = consents?.find((consent) => consent.type === 'marketing')?.agreed ?? false;

  return (
    <div className='flex flex-col px-24 pt-16 pb-[120px] gap-[40px]'>
      <List>
        <List.Item>
          <List.Item.Content title='마케팅 수신 동의' />
          <List.Item.Trailing>
            <Toggle checked={marketing} onChange={patchMarketing} />
          </List.Item.Trailing>
        </List.Item>
      </List>
    </div>
  );
};

export default ConsentsPage;
