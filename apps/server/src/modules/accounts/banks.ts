/**
 * 계좌 등록 가능한 은행 화이트리스트 (표시명 기준).
 * 프론트 드롭다운과 동일해야 하므로 `GET /accounts/banks`로도 노출한다.
 */
export const BANKS = [
  'NH농협은행',
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'IBK기업은행',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
  'SC제일은행',
  '씨티은행',
  '부산은행',
  'iM뱅크(대구)',
  '경남은행',
  '광주은행',
  '전북은행',
  '제주은행',
  '새마을금고',
  '신협',
  '우체국',
  '수협은행',
  'KDB산업은행',
  'SBI저축은행',
  '저축은행',
  '산림조합',
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
