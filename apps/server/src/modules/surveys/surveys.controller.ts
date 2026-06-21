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

  /** POST /surveys/:surveyId/start — 설문 참여 시작(외부 설문 이동 직전, started 선기록) */
  @Post(':surveyId/start')
  start(@CurrentUser() user: AuthUser, @Param('surveyId', ParseUUIDPipe) surveyId: string) {
    return this.service.start(user.id, surveyId);
  }

  /** POST /surveys/:surveyId/complete — 설문 완료 인증(start 기록 필요) */
  @Post(':surveyId/complete')
  complete(@CurrentUser() user: AuthUser, @Param('surveyId', ParseUUIDPipe) surveyId: string) {
    return this.service.complete(user.id, surveyId);
  }
}
