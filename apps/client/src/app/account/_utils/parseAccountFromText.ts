import type { CreateAccountRequest } from '@/app/account/_types/types';

/** 계좌번호로 인정할 최소 숫자 길이 (하이픈 제외). */
const MIN_ACCOUNT_DIGITS = 10;

/** 하이픈으로 연결된 숫자 또는 10자리 이상 연속 숫자. */
const ACCOUNT_NO_REGEX = /\d[\d-]{8,}\d/g;

const findBank = (text: string, banks: string[]) =>
  banks.find((bank) => text.includes(bank)) ?? null;

const findAccountNo = (text: string) => {
  const matches = text.match(ACCOUNT_NO_REGEX);
  if (!matches) return null;

  const matched = matches
    .map((match) => match.replace(/-/g, ''))
    .find((digits) => digits.length >= MIN_ACCOUNT_DIGITS);

  return matched ?? null;
};

/**
 * 클립보드 등 외부 텍스트에서 은행명·계좌번호를 추출합니다.
 */
export const parseAccountFromText = (
  text: string,
  banks: string[],
): Partial<CreateAccountRequest> | null => {
  if (!text.trim()) return null;

  const bank = findBank(text, banks);
  const accountNo = findAccountNo(text);

  if (!bank && !accountNo) return null;

  return {
    ...(bank ? { bank } : {}),
    ...(accountNo ? { accountNo } : {}),
  };
};
