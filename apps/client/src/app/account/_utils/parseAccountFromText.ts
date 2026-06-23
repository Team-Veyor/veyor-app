import type { CreateAccountRequest } from '@/app/account/_types/types';

/** 계좌번호로 인정할 최소 숫자 길이 (하이픈 제외). */
const MIN_ACCOUNT_DIGITS = 10;

/** 하이픈으로 연결된 숫자 또는 10자리 이상 연속 숫자. */
const ACCOUNT_NO_REGEX = /\d[\d-]{8,}\d/g;

const BANK_ALIASES: Record<string, string[]> = {
  NH농협은행: ['NH농협', '농협', '농협은행'],
  KB국민은행: ['KB국민', '국민', '국민은행'],
  신한은행: ['신한'],
  우리은행: ['우리'],
  하나은행: ['하나'],
  IBK기업은행: ['IBK기업', '기업', '기업은행'],
  카카오뱅크: ['카뱅', '카카오', '카카오은행'],
  토스뱅크: ['토스', '토스은행'],
  케이뱅크: ['케뱅', '케이', 'K뱅크', 'Kbank'],
  SC제일은행: ['SC제일', '제일', '제일은행'],
  씨티은행: ['씨티'],
  부산은행: ['부산'],
  'iM뱅크(대구)': ['iM뱅크', 'IM뱅크', '대구', '대구은행'],
  경남은행: ['경남'],
  광주은행: ['광주'],
  전북은행: ['전북'],
  제주은행: ['제주'],
  새마을금고: ['새마을', 'MG새마을금고', 'MG'],
  수협은행: ['수협'],
  KDB산업은행: ['KDB산업', '산업', '산업은행'],
  SBI저축은행: ['SBI저축', 'SBI'],
};

const normalizeBankText = (value: string) => value.toLowerCase().replace(/\s/g, '');

const getBankAliases = (bank: string) => {
  const shortName = bank.endsWith('은행') ? bank.slice(0, -2) : bank;
  return [bank, shortName, ...(BANK_ALIASES[bank] ?? [])]
    .filter((alias) => alias.length >= 2)
    .sort((a, b) => b.length - a.length);
};

const findBank = (text: string, banks: string[]) => {
  const normalizedText = normalizeBankText(text);

  return (
    banks.find((bank) =>
      getBankAliases(bank).some((alias) => normalizedText.includes(normalizeBankText(alias))),
    ) ?? null
  );
};

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
