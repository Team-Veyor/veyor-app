import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import type { AuthUser } from '../../core/auth/types';
import { ParticipationsService } from './participations.service';

@Controller('participations')
export class ParticipationsController {
  constructor(private readonly service: ParticipationsService) {}

  /** GET /participations?from=YYYY-MM-DD&to=YYYY-MM-DD — 참여 내역(기간 필터) */
  @Get()
  list(@CurrentUser() user: AuthUser, @Query('from') from?: string, @Query('to') to?: string) {
    const fromIso = this.parseDate(from, 'from', false);
    const toIso = this.parseDate(to, 'to', true);
    return this.service.list(user.id, fromIso, toIso);
  }

  private parseDate(
    value: string | undefined,
    name: string,
    endOfDay: boolean,
  ): string | undefined {
    if (!value) {
      return undefined;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${name}는 YYYY-MM-DD 형식이어야 합니다.`);
    }
    return endOfDay ? `${value}T23:59:59.999Z` : `${value}T00:00:00.000Z`;
  }
}
