import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Env } from '../config/env.validation';

/**
 * DB 접근 및 토큰 검증의 단일 진입점. (Supabase 신규 API 키 포맷 기준)
 *
 * - `admin`         : secret key 기반. RLS를 우회하므로 서버 관리 작업 전용. 신중히 사용.
 * - `getUser(jwt)`  : 사용자 access token 검증.
 * - `forUser(jwt)`  : 사용자 컨텍스트(RLS 적용) 클라이언트. publishable key가 있을 때만.
 *
 * 도메인 코드는 이 서비스를 직접 쓰기보다 각 모듈의 Repository를 통해 사용한다.
 */
@Injectable()
export class SupabaseService {
  readonly admin: SupabaseClient;

  private readonly url: string;
  private readonly publishableKey?: string;
  private static readonly clientOptions = {
    auth: { persistSession: false, autoRefreshToken: false },
  };

  constructor(config: ConfigService<Env, true>) {
    this.url = config.get('SUPABASE_URL', { infer: true });
    this.publishableKey = config.get('SUPABASE_PUBLISHABLE_KEY', { infer: true });
    const secretKey = config.get('SUPABASE_SECRET_KEY', { infer: true });

    this.admin = createClient(this.url, secretKey, SupabaseService.clientOptions);
  }

  /** 사용자 access token(JWT)을 검증하고 사용자 정보를 반환한다. */
  getUser(accessToken: string) {
    return this.admin.auth.getUser(accessToken);
  }

  /**
   * 사용자 토큰 컨텍스트로 동작하는(RLS 적용) 클라이언트를 만든다.
   * `SUPABASE_PUBLISHABLE_KEY`가 설정된 경우에만 사용할 수 있다.
   */
  forUser(accessToken: string): SupabaseClient {
    if (!this.publishableKey) {
      throw new Error(
        'SUPABASE_PUBLISHABLE_KEY가 없어 사용자 컨텍스트 클라이언트를 만들 수 없습니다.',
      );
    }
    return createClient(this.url, this.publishableKey, {
      ...SupabaseService.clientOptions,
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
  }
}
