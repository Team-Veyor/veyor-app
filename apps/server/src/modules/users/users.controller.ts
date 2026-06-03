import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import type { AuthUser } from '../../core/auth/types';
import { validateOnboarding } from './dto/onboarding.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  /** GET /users/me — 내 프로필 + 누적 현황 */
  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.service.getMe(user.id);
  }

  /** POST /users/onboarding — 온보딩(정보 입력 + 약관 동의) */
  @Post('onboarding')
  @HttpCode(201)
  onboarding(@CurrentUser() user: AuthUser, @Body() body: unknown) {
    return this.service.onboarding(user.id, validateOnboarding(body));
  }

  /** DELETE /users/me — 회원 탈퇴 */
  @Delete('me')
  @HttpCode(204)
  remove(@CurrentUser() user: AuthUser) {
    return this.service.deleteMe(user.id);
  }
}
