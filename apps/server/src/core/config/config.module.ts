import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './env.validation';

/**
 * 전역 설정 모듈. `ConfigService<Env, true>`를 주입받아 타입 안전하게 환경변수를 읽는다.
 * 코드 어디서도 `process.env`를 직접 읽지 않는 것이 원칙.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
  ],
})
export class AppConfigModule {}
