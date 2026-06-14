import type { Consent } from '@/app/policy/_types/types';
import { apiFetch } from '@/lib/api';

const getConsents = () => {
  return apiFetch<Consent[]>('/consents');
};

export default getConsents;
