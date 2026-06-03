import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../core/supabase/supabase.service';

export interface ProfileRow {
  id: string;
  name: string | null;
  email: string | null;
  birth_year: number | null;
  gender: string | null;
  onboarded_at: string | null;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  async getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await this.db
      .from('profiles')
      .select('id, name, email, birth_year, gender, onboarded_at')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      throw new InternalServerErrorException('프로필을 불러오지 못했습니다.');
    }
    return (data as ProfileRow) ?? null;
  }

  async updateProfile(
    userId: string,
    patch: Partial<{ birth_year: number; gender: string; onboarded_at: string }>,
  ): Promise<ProfileRow> {
    const { data, error } = await this.db
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select('id, name, email, birth_year, gender, onboarded_at')
      .single();
    if (error) {
      throw new InternalServerErrorException('프로필 저장에 실패했습니다.');
    }
    return data as ProfileRow;
  }

  /** Auth 사용자 삭제(탈퇴). FK cascade로 앱 데이터도 함께 삭제됨. */
  async deleteAuthUser(userId: string): Promise<void> {
    const { error } = await this.supabase.admin.auth.admin.deleteUser(userId);
    if (error) {
      throw new InternalServerErrorException('탈퇴 처리에 실패했습니다.');
    }
  }
}
