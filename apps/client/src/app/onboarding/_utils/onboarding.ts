import type { AgreementId, Consents } from '@/app/onboarding/_types/types';

export const parseBirthYear = (value: string) => {
  if (value === '') {
    return null;
  }

  const birthYear = Number(value);
  return Number.isInteger(birthYear) ? birthYear : null;
};

export const createConsents = (agreedIds: readonly AgreementId[]): Consents => {
  const agreedIdSet = new Set(agreedIds);

  return {
    privacy: agreedIdSet.has('privacy'),
    terms: agreedIdSet.has('terms'),
    marketing: agreedIdSet.has('marketing'),
  };
};
