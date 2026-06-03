import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import type { AuthUser } from './types';

/**
 * `Authorization: Bearer <JWT>` 헤더의 Supabase 토큰을 검증하고,
 * 통과 시 `request.user`에 사용자 정보를 주입한다.
 *
 * 검증은 Supabase Auth 서버에 위임한다(`auth.getUser(token)`).
 * 로그인/회원가입은 클라이언트에서 Supabase Auth(카카오 OAuth)가 처리하므로 여기엔 없다.
 *
 * 사용: 라우트/컨트롤러에 `@UseGuards(SupabaseJwtGuard)`.
 * 전역 등록 시에는 `@Public()`으로 예외 라우트를 표시한다.
 */
@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('인증 토큰이 없습니다.');
    }

    const { data, error } = await this.supabase.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    request.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      metadata: data.user.user_metadata ?? {},
    };
    return true;
  }

  private extractToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header) {
      return null;
    }
    const [type, token] = header.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
