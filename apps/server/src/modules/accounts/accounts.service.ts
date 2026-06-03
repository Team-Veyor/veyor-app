import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decrypt, encrypt, maskAccountNo } from '../../common/utils/account-crypto';
import type { Env } from '../../core/config/env.validation';
import { type AccountRow, AccountsRepository } from './accounts.repository';
import type { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';

export interface AccountView {
  id: string;
  bank: string;
  accountNoMasked: string;
  holderName: string;
  isPrimary: boolean;
}

@Injectable()
export class AccountsService {
  private readonly encKey: string;

  constructor(
    private readonly repo: AccountsRepository,
    config: ConfigService<Env, true>,
  ) {
    this.encKey = config.get('ACCOUNT_ENC_KEY', { infer: true });
  }

  private toView(row: AccountRow): AccountView {
    return {
      id: row.id,
      bank: row.bank,
      accountNoMasked: maskAccountNo(decrypt(row.account_no, this.encKey)),
      holderName: row.holder_name,
      isPrimary: row.is_primary,
    };
  }

  async list(userId: string): Promise<AccountView[]> {
    const rows = await this.repo.listByUser(userId);
    return rows.map((r) => this.toView(r));
  }

  async hasAny(userId: string): Promise<boolean> {
    return (await this.repo.countByUser(userId)) > 0;
  }

  async create(userId: string, dto: CreateAccountDto): Promise<AccountView> {
    const isFirst = (await this.repo.countByUser(userId)) === 0;
    const row = await this.repo.insert(userId, {
      bank: dto.bank,
      account_no: encrypt(dto.accountNo, this.encKey),
      holder_name: dto.holderName,
      is_primary: isFirst, // 첫 계좌는 자동 대표
    });
    return this.toView(row);
  }

  async update(userId: string, id: string, dto: UpdateAccountDto): Promise<AccountView> {
    await this.getOwnedOrThrow(userId, id);
    const patch: Partial<{ bank: string; account_no: string; holder_name: string }> = {};
    if (dto.bank !== undefined) {
      patch.bank = dto.bank;
    }
    if (dto.holderName !== undefined) {
      patch.holder_name = dto.holderName;
    }
    if (dto.accountNo !== undefined) {
      patch.account_no = encrypt(dto.accountNo, this.encKey);
    }
    const row = await this.repo.update(userId, id, patch);
    return this.toView(row);
  }

  async setPrimary(userId: string, id: string): Promise<{ id: string; isPrimary: true }> {
    await this.getOwnedOrThrow(userId, id);
    await this.repo.clearPrimary(userId);
    await this.repo.setPrimary(userId, id);
    return { id, isPrimary: true };
  }

  async remove(userId: string, id: string) {
    const target = await this.getOwnedOrThrow(userId, id);
    await this.repo.delete(userId, id);

    let primaryReassigned: string | null = null;
    let needsPrimarySelection = false;

    if (target.is_primary) {
      const remaining = await this.repo.listByUser(userId);
      if (remaining.length === 1) {
        await this.repo.setPrimary(userId, remaining[0].id);
        primaryReassigned = remaining[0].id;
      } else if (remaining.length >= 2) {
        needsPrimarySelection = true; // 대표 선택 Bottom Sheet 필요
      }
    }

    return { deleted: true, primaryReassigned, needsPrimarySelection };
  }

  private async getOwnedOrThrow(userId: string, id: string): Promise<AccountRow> {
    const row = await this.repo.findOwned(userId, id);
    if (!row) {
      throw new NotFoundException('계좌를 찾을 수 없습니다.');
    }
    return row;
  }
}
