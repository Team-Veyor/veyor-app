import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 인증 없이 접근 가능한 라우트에 표시한다.
 * `SupabaseJwtGuard`를 전역으로 등록했을 때 예외 처리에 사용.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
