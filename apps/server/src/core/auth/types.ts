/**
 * Supabase JWT 검증 후 `request.user`에 실리는 인증 사용자 정보.
 * 카카오 OAuth로 로그인한 사용자도 동일한 형태로 표현된다.
 */
export interface AuthUser {
  /** Supabase user id (JWT `sub`) */
  id: string;
  email?: string;
  /** Supabase 역할 (보통 'authenticated') */
  role?: string;
  /** provider/닉네임 등 부가 메타데이터 (예: 카카오 프로필) */
  metadata: Record<string, unknown>;
}
