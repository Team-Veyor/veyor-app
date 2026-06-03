import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../core/supabase/supabase.service';

export interface AccountRow {
  id: string;
  bank: string;
  account_no: string; // 암호화 저장
  holder_name: string;
  is_primary: boolean;
}

const COLS = 'id, bank, account_no, holder_name, is_primary';

@Injectable()
export class AccountsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  async listByUser(userId: string): Promise<AccountRow[]> {
    const { data, error } = await this.db
      .from('accounts')
      .select(COLS)
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });
    if (error) {
      throw new InternalServerErrorException('계좌를 불러오지 못했습니다.');
    }
    return (data as AccountRow[]) ?? [];
  }

  async findOwned(userId: string, id: string): Promise<AccountRow | null> {
    const { data } = await this.db
      .from('accounts')
      .select(COLS)
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();
    return (data as AccountRow) ?? null;
  }

  async countByUser(userId: string): Promise<number> {
    const { count, error } = await this.db
      .from('accounts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) {
      throw new InternalServerErrorException('계좌를 불러오지 못했습니다.');
    }
    return count ?? 0;
  }

  async insert(
    userId: string,
    row: { bank: string; account_no: string; holder_name: string; is_primary: boolean },
  ): Promise<AccountRow> {
    const { data, error } = await this.db
      .from('accounts')
      .insert({ user_id: userId, ...row })
      .select(COLS)
      .single();
    if (error) {
      throw new InternalServerErrorException('계좌 저장에 실패했습니다. 다시 시도해주세요.');
    }
    return data as AccountRow;
  }

  async update(
    userId: string,
    id: string,
    patch: Partial<{ bank: string; account_no: string; holder_name: string }>,
  ): Promise<AccountRow> {
    const { data, error } = await this.db
      .from('accounts')
      .update(patch)
      .eq('user_id', userId)
      .eq('id', id)
      .select(COLS)
      .single();
    if (error) {
      throw new InternalServerErrorException('계좌 저장에 실패했습니다. 다시 시도해주세요.');
    }
    return data as AccountRow;
  }

  async clearPrimary(userId: string): Promise<void> {
    await this.db
      .from('accounts')
      .update({ is_primary: false })
      .eq('user_id', userId)
      .eq('is_primary', true);
  }

  async setPrimary(userId: string, id: string): Promise<void> {
    const { error } = await this.db
      .from('accounts')
      .update({ is_primary: true })
      .eq('user_id', userId)
      .eq('id', id);
    if (error) {
      throw new InternalServerErrorException('대표 계좌 설정에 실패했습니다.');
    }
  }

  async delete(userId: string, id: string): Promise<void> {
    const { error } = await this.db.from('accounts').delete().eq('user_id', userId).eq('id', id);
    if (error) {
      throw new InternalServerErrorException('계좌 삭제에 실패했습니다.');
    }
  }
}
