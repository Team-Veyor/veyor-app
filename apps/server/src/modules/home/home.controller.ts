import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import type { AuthUser } from '../../core/auth/types';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly service: HomeService) {}

  @Get()
  getHome(@CurrentUser() user: AuthUser) {
    return this.service.getHome(user.id);
  }
}
