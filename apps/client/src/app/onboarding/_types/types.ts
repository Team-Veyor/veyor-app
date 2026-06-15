export type Gender = 'male' | 'female';

export type AgreementId = 'privacy' | 'terms' | 'marketing';

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
  consents: Consents;
};

export type OnboardingResponse = {
  onboarded: boolean;
};
