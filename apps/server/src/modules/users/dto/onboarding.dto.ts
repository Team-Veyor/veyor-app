import { BadRequestException } from '@nestjs/common';

export interface OnboardingDto {
  birthYear: number;
  gender: 'male' | 'female';
  consents: { privacy: boolean; terms: boolean; marketing?: boolean };
}

export function validateOnboarding(body: unknown): OnboardingDto {
  const b = (body ?? {}) as Record<string, unknown>;

  const birthYear = Number(b.birthYear);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > currentYear) {
    throw new BadRequestException('출생연도가 올바르지 않습니다.');
  }

  if (b.gender !== 'male' && b.gender !== 'female') {
    throw new BadRequestException('성별은 male 또는 female 이어야 합니다.');
  }

  const consents = (b.consents ?? {}) as Record<string, unknown>;
  const toBool = (v: unknown) => v === true;
  const privacy = toBool(consents.privacy);
  const terms = toBool(consents.terms);
  const marketing = toBool(consents.marketing);

  return { birthYear, gender: b.gender, consents: { privacy, terms, marketing } };
}
