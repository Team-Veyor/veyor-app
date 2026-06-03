import { BadRequestException } from '@nestjs/common';

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

export function validateCreate(body: unknown): CreateAccountDto {
  const b = (body ?? {}) as Record<string, unknown>;
  if (
    !isNonEmptyString(b.bank) ||
    !isNonEmptyString(b.accountNo) ||
    !isNonEmptyString(b.holderName)
  ) {
    throw new BadRequestException('은행·계좌번호·예금주명은 필수입니다.');
  }
  if (!/^[0-9-]{6,30}$/.test(b.accountNo.trim())) {
    throw new BadRequestException('계좌번호 형식이 올바르지 않습니다.');
  }
  return { bank: b.bank.trim(), accountNo: b.accountNo.trim(), holderName: b.holderName.trim() };
}

export function validateUpdate(body: unknown): UpdateAccountDto {
  const b = (body ?? {}) as Record<string, unknown>;
  const dto: UpdateAccountDto = {};
  if (b.bank !== undefined) {
    if (!isNonEmptyString(b.bank)) {
      throw new BadRequestException('은행이 올바르지 않습니다.');
    }
    dto.bank = b.bank.trim();
  }
  if (b.accountNo !== undefined) {
    if (!isNonEmptyString(b.accountNo) || !/^[0-9-]{6,30}$/.test(b.accountNo.trim())) {
      throw new BadRequestException('계좌번호 형식이 올바르지 않습니다.');
    }
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
