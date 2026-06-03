import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import type { AuthUser } from '../../core/auth/types';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly service: SurveysService) {}

  /** GET /surveys/today — 오늘 노출 설문 1건(없으면 null) */
  @Get('today')
  getToday(@CurrentUser() user: AuthUser) {
    return this.service.getToday(user.id);
  }

  /** POST /surveys/:surveyId/complete — 설문 완료 인증 */
  @Post(':surveyId/complete')
  complete(@CurrentUser() user: AuthUser, @Param('surveyId', ParseUUIDPipe) surveyId: string) {
    return this.service.complete(user.id, surveyId);
  }
}
