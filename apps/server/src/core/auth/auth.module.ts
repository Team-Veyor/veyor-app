import { Module } from '@nestjs/common';
import { AuthClientLogController } from './auth-client-log.controller';
import { SupabaseJwtGuard } from './supabase-jwt.guard';

/**
 * 인증 모듈. `SupabaseJwtGuard`를 제공한다.
 * (`SupabaseService`는 전역 `SupabaseModule`에서 주입됨)
 */
@Module({
  controllers: [AuthClientLogController],
  providers: [SupabaseJwtGuard],
  exports: [SupabaseJwtGuard],
})
export class AuthModule {}
