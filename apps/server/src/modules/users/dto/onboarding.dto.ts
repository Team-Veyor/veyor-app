import { BadRequestException } from '@nestjs/common';

/**
 * 선택 가능한 직업군 코드(서버 저장·전송 값). surveys.target_occupation 과 동일한 집합.
 * 표시 라벨(한글)은 client/admin에서 매핑한다.
 *   school_student=중·고등학생, college_student=대학생, graduate_student=대학원생,
 *   job_seeker=취업 준비생, office_worker=직장인, freelancer=프리랜서,
 *   self_employed=자영업자, homemaker=주부, unemployed=무직, retired=은퇴, other=기타
 */
export const OCCUPATIONS = [
  'school_student',
  'college_student',
  'graduate_student',
  'job_seeker',
  'office_worker',
  'freelancer',
  'self_employed',
  'homemaker',
  'unemployed',
  'retired',
  'other',
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
