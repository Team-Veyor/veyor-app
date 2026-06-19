export type Gender = 'male' | 'female';

export type Occupation = '중학생' | '고등학생' | '대학생' | '직장인' | '무직' | '주부' | '기타';

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
