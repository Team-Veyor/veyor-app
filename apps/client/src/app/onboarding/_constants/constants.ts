import type {
  AgreementId,
  AgreementItem,
  Gender,
  IntroSlide,
  Occupation,
} from '@/app/onboarding/_types/types';
import type { SelectOption } from '@/components/Select/Select';

export const AGREEMENT_ITEMS = [
  { id: 'age', label: '만 14세 이상입니다.', required: true },
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'terms', label: '백설기 서비스 이용 약관 동의', required: true },
  { id: 'marketing', label: '마케팅 수신 동의', required: false },
] as const satisfies readonly AgreementItem[];

export const AGREEMENT_IDS: readonly AgreementId[] = ['privacy', 'terms', 'marketing'];

export const GENDER_OPTIONS: readonly { label: string; value: Gender }[] = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' },
];

export const OCCUPATION_BOTTOM_SHEET = {
  title: '직업 상태',
  description: '현재 본인과 가장 가까운 상태를 선택해주세요.',
} as const;

export const OCCUPATION_OPTIONS: readonly (SelectOption & { value: Occupation })[] = [
  { label: '중학생', value: '중학생' },
  { label: '고등학생', value: '고등학생' },
  { label: '대학생', value: '대학생' },
  { label: '직장인', value: '직장인' },
  { label: '무직', value: '무직' },
  { label: '주부', value: '주부' },
  { label: '기타', value: '기타' },
];

export const BIRTH_YEAR_HELPER_TEXT = {
  default: '4자리(예: 1998)',
  format: '4자리 숫자만 입력 가능합니다.(예: 1998)',
  range: '올바른 연도를 입력해 주세요.',
} as const;

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
