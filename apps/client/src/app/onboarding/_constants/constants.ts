import type { AgreementId, AgreementItem, Gender, IntroSlide } from '@/app/onboarding/_types/types';

export const AGREEMENT_ITEMS = [
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'terms', label: '백설기 서비스 이용 약관 동의', required: true },
  { id: 'marketing', label: '마케팅 수신 동의', required: false },
] as const satisfies readonly AgreementItem[];

export const AGREEMENT_IDS: readonly AgreementId[] = ['privacy', 'terms', 'marketing'];

export const GENDER_OPTIONS: readonly { label: string; value: Gender }[] = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' },
];

export const INTRO_SLIDES = [
  {
    id: 'daily-survey',
    title: '매일 1~5분\n설문 1개씩 참여하면',
    imageSrc: '/onboarding/onboarding1.png',
  },
  {
    id: 'reward-account',
    title: '보상을 계좌로\n익일 입금',
    imageSrc: '/onboarding/onboarding2.png',
  },
  {
    id: 'simple-reward',
    title: '복잡한 가입, 미션 없이\n참여한 만큼 보상받아요',
    imageSrc: '/onboarding/onboarding3.png',
  },
] as const satisfies readonly IntroSlide[];
