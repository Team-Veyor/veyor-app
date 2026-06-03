import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

/**
 * 전역 모듈. 어느 모듈에서나 `SupabaseService`를 주입받을 수 있다.
 */
@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
