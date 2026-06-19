import { BadRequestException } from '@nestjs/common';

/** 선택 가능한 직업군. surveys.target_occupation 과 동일한 집합. */
export const OCCUPATIONS = [
  '중학생',
  '고등학생',
  '대학생',
  '직장인',
  '무직',
  '주부',
  '기타',
] as const;
export type Occupation = (typeof OCCUPATIONS)[number];

export interface OnboardingDto {
  birthYear: number;
  gender: 'male' | 'female';
  occupation?: Occupation;
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

  // 직업은 선택값(미입력 허용). 들어오면 허용 목록 안에 있어야 함.
  let occupation: Occupation | undefined;
  if (b.occupation != null && b.occupation !== '') {
    if (!OCCUPATIONS.includes(b.occupation as Occupation)) {
      throw new BadRequestException('직업 값이 올바르지 않습니다.');
    }
    occupation = b.occupation as Occupation;
  }

  const consents = (b.consents ?? {}) as Record<string, unknown>;
  const toBool = (v: unknown) => v === true;
  const privacy = toBool(consents.privacy);
  const terms = toBool(consents.terms);
  const marketing = toBool(consents.marketing);

  return { birthYear, gender: b.gender, occupation, consents: { privacy, terms, marketing } };
}
