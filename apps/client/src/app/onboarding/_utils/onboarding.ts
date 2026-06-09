import type { AgreementId, Consents } from '@/app/onboarding/_types/types';

export const createConsents = (agreedIds: readonly AgreementId[]): Consents => {
  const agreedIdSet = new Set(agreedIds);

  return {
    privacy: agreedIdSet.has('privacy'),
    terms: agreedIdSet.has('terms'),
    marketing: agreedIdSet.has('marketing'),
  };
};
