export type Gender = 'male' | 'female';

// 서버(onboarding.dto OCCUPATIONS)·어드민과 동일한 영문 코드 집합. 서버 저장·전송 값.
export type Occupation =
  | 'school_student'
  | 'college_student'
  | 'graduate_student'
  | 'job_seeker'
  | 'office_worker'
  | 'freelancer'
  | 'self_employed'
  | 'homemaker'
  | 'unemployed'
  | 'retired'
  | 'other';

export type AgreementId = 'age' | 'privacy' | 'terms' | 'marketing';

export type AgreementItem = {
  id: AgreementId;
  label: string;
  required?: boolean;
};

export type IntroSlide = {
  id: string;
  title: string;
  imageSrc: string;
};

export type Consents = Record<AgreementId, boolean>;

export type OnboardingRequest = {
  birthYear: number;
  gender: Gender;
  occupation: Occupation;
  consents: Consents;
};

export type OnboardingResponse = {
  onboarded: boolean;
};
