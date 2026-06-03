import { BadRequestException } from '@nestjs/common';
import { isSupportedBank, normalizeAccountNo } from '../banks';

export interface CreateAccountDto {
  bank: string;
  accountNo: string;
  holderName: string;
}

export interface UpdateAccountDto {
  bank?: string;
  accountNo?: string;
  holderName?: string;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/** 계좌번호 형식: 숫자(하이픈 제거 후) 10~16자리. */
function assertAccountNoFormat(value: string): void {
  const digits = normalizeAccountNo(value);
  if (digits.length < 10 || digits.length > 16) {
    throw new BadRequestException('계좌번호는 숫자 10~16자리여야 합니다.');
  }
}

function assertBank(value: string): void {
  if (!isSupportedBank(value)) {
    throw new BadRequestException('지원하지 않는 은행입니다.');
  }
}

export function validateCreate(body: unknown): CreateAccountDto {
  const b = (body ?? {}) as Record<string, unknown>;
  if (
    !isNonEmptyString(b.bank) ||
    !isNonEmptyString(b.accountNo) ||
    !isNonEmptyString(b.holderName)
  ) {
    throw new BadRequestException('은행·계좌번호·예금주명은 필수입니다.');
  }
  assertBank(b.bank.trim());
  assertAccountNoFormat(b.accountNo);
  return { bank: b.bank.trim(), accountNo: b.accountNo.trim(), holderName: b.holderName.trim() };
}

export function validateUpdate(body: unknown): UpdateAccountDto {
  const b = (body ?? {}) as Record<string, unknown>;
  const dto: UpdateAccountDto = {};
  if (b.bank !== undefined) {
    if (!isNonEmptyString(b.bank)) {
      throw new BadRequestException('은행이 올바르지 않습니다.');
    }
    assertBank(b.bank.trim());
    dto.bank = b.bank.trim();
  }
  if (b.accountNo !== undefined) {
    if (!isNonEmptyString(b.accountNo)) {
      throw new BadRequestException('계좌번호가 올바르지 않습니다.');
    }
    assertAccountNoFormat(b.accountNo);
    dto.accountNo = b.accountNo.trim();
  }
  if (b.holderName !== undefined) {
    if (!isNonEmptyString(b.holderName)) {
      throw new BadRequestException('예금주명이 올바르지 않습니다.');
    }
    dto.holderName = b.holderName.trim();
  }
  if (Object.keys(dto).length === 0) {
    throw new BadRequestException('수정할 항목이 없습니다.');
  }
  return dto;
}
