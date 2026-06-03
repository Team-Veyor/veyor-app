import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { AppConfigModule } from './core/config/config.module';
import { SupabaseModule } from './core/supabase/supabase.module';

@Module({
  imports: [
    // core (전역 인프라)
    AppConfigModule,
    SupabaseModule,
    AuthModule,
    // modules (도메인 기능) — 여기에 추가: e.g. UserModule, VoteModule ...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
