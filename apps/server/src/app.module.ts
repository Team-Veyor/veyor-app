import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { SupabaseJwtGuard } from './core/auth/supabase-jwt.guard';
import { AppConfigModule } from './core/config/config.module';
import { SupabaseModule } from './core/supabase/supabase.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { HomeModule } from './modules/home/home.module';
import { ParticipationsModule } from './modules/participations/participations.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { TermsModule } from './modules/terms/terms.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // core (전역 인프라)
    AppConfigModule,
    SupabaseModule,
    AuthModule,
    // modules (도메인 기능)
    UsersModule,
    ConsentsModule,
    AccountsModule,
    SurveysModule,
    ParticipationsModule,
    HomeModule,
    TermsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 전역 인증: 모든 라우트 보호, @Public() 라우트만 예외
    { provide: APP_GUARD, useClass: SupabaseJwtGuard },
  ],
})
export class AppModule {}
