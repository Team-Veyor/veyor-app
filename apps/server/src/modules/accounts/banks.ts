/**
 * 계좌 등록 가능한 은행 화이트리스트 (표시명 기준).
 * 프론트 드롭다운과 **순서·명칭이 동일**해야 하므로 `GET /accounts/banks`로 이 순서 그대로 노출한다.
 */
export const BANKS = [
  'KB국민',
  '신한',
  '우리',
  '하나',
  'NH농협',
  'IBK기업',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
  '광주',
  '전북',
  '경남',
  '부산',
  'KDB산업',
  'IM뱅크',
  'sbi저축',
  'SC제일',
  '새마을',
  '산림조합',
  '수협',
  '신협',
  '씨티',
  '우체국',
  '제주',
  '저축은행',
] as const;

export type Bank = (typeof BANKS)[number];

const BANK_SET = new Set<string>(BANKS);

export function isSupportedBank(name: string): boolean {
  return BANK_SET.has(name);
}

/** 계좌번호 정규화: 숫자만 남김(하이픈/공백 제거). 중복 비교·검증용. */
export function normalizeAccountNo(value: string): string {
  return value.replace(/\D/g, '');
}
