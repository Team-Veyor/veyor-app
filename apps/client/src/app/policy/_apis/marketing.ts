import type { Consent } from '@/app/policy/_types/types';
import { apiFetch } from '@/lib/api';

const patchMarketing = (marketing: boolean) => {
  return apiFetch<Consent>('/consents', {
    method: 'PATCH',
    json: { marketing },
  });
};

export default patchMarketing;
