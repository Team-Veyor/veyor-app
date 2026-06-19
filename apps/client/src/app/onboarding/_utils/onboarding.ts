import type { AgreementId, Consents } from '@/app/onboarding/_types/types';

export const createConsents = (agreedIds: readonly AgreementId[]): Consents => {
  const agreedIdSet = new Set(agreedIds);

  return {
    age: agreedIdSet.has('age'),
    privacy: agreedIdSet.has('privacy'),
    terms: agreedIdSet.has('terms'),
    marketing: agreedIdSet.has('marketing'),
  };
};

export type BirthYearError = 'format' | 'range';

export const getBirthYearError = (value: string): BirthYearError | null => {
  if (!/^\d{4}$/.test(value)) return 'format';

  const year = Number(value);
  if (year < 1900 || year > new Date().getFullYear()) return 'range';

  return null;
};

export const isValidBirthYear = (value: string): boolean => getBirthYearError(value) === null;
