import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../core/supabase/supabase.service';

export interface ConsentRow {
  type: string;
  agreed: boolean;
  agreed_at: string | null;
}

@Injectable()
export class ConsentsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  async listByUser(userId: string): Promise<ConsentRow[]> {
    const { data, error } = await this.db
      .from('consents')
      .select('type, agreed, agreed_at')
      .eq('user_id', userId);
    if (error) {
      throw new InternalServerErrorException('동의 정보를 불러오지 못했습니다.');
    }
    return (data as ConsentRow[]) ?? [];
  }

  /** (user_id, type) 기준 upsert */
  async upsertMany(
    userId: string,
    items: { type: string; agreed: boolean; agreed_at: string | null }[],
  ): Promise<void> {
    const rows = items.map((i) => ({ user_id: userId, ...i }));
    const { error } = await this.db.from('consents').upsert(rows, { onConflict: 'user_id,type' });
    if (error) {
      throw new InternalServerErrorException('동의 정보를 저장하지 못했습니다.');
    }
  }
}
