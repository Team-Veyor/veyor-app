import { z } from 'zod';

/**
 * 앱이 의존하는 환경변수 스키마.
 * 부팅 시점에 검증하여, 누락/오타가 있으면 서버가 뜨지 않도록 한다.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.url().default('http://localhost:3000'),

  // Supabase (신규 API 키 포맷)
  SUPABASE_URL: z.url(),
  // 서버 전용 secret key (sb_secret_...). RLS 우회. 절대 노출 금지.
  SUPABASE_SECRET_KEY: z.string().min(1),
  // (선택) 클라이언트/RLS 컨텍스트용 publishable key (sb_publishable_...).
  // .env 에 빈 값으로 남겨둔 경우 "미설정"으로 취급한다.
  SUPABASE_PUBLISHABLE_KEY: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().min(1).optional(),
  ),

  // 계좌번호 등 민감정보 암호화 키. 프로덕션에서는 반드시 별도 값으로 설정.
  ACCOUNT_ENC_KEY: z.string().min(1).default('dev-veyor-account-enc-key-change-me'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * @nestjs/config 의 `validate` 훅. 검증 실패 시 명확한 메시지와 함께 throw.
 */
export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`환경변수 검증 실패:\n${issues}`);
  }
  return parsed.data;
}
