'use client';

import { useState } from 'react';
import PolicyBottomSheet from '@/app/policy/terms/_components/PolicyBottomSheet';
import { POLICIES, type PolicyId } from '@/app/policy/terms/_constants/policies';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import List from '@/components/List/List';

const POLICY_ITEMS: PolicyId[] = ['privacy-consent', 'service-terms', 'privacy-policy'];

const TermsPage = () => {
  const [openPolicyId, setOpenPolicyId] = useState<PolicyId | null>(null);
  const openPolicy = openPolicyId ? POLICIES[openPolicyId] : null;

  return (
    <div className='flex flex-col px-16 pt-8'>
      <List>
        {POLICY_ITEMS.map((id) => (
          <List.Item key={id} onClick={() => setOpenPolicyId(id)}>
            <List.Item.Content title={POLICIES[id].title} />
            <List.Item.Trailing>
              <ChevronDownIcon />
            </List.Item.Trailing>
          </List.Item>
        ))}
      </List>

      {openPolicy && (
        <PolicyBottomSheet
          className='h-[80dvh]'
          title={openPolicy.title}
          description={openPolicy.description}
          onClose={() => setOpenPolicyId(null)}
        >
          {openPolicy.content}
        </PolicyBottomSheet>
      )}
    </div>
  );
};

export default TermsPage;
