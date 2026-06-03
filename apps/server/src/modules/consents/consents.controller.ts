import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import type { AuthUser } from '../../core/auth/types';
import { ConsentsService, type ConsentType } from './consents.service';

@Controller('consents')
export class ConsentsController {
  constructor(private readonly service: ConsentsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user.id);
  }

  /** PATCH /consents — 마케팅/개인정보 등 동의 토글 */
  @Patch()
  patch(@CurrentUser() user: AuthUser, @Body() body: Partial<Record<ConsentType, boolean>>) {
    return this.service.setMany(user.id, body ?? {});
  }
}
