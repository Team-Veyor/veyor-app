import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import type { AuthUser } from '../../core/auth/types';
import { AccountsService } from './accounts.service';
import { validateCreate, validateUpdate } from './dto/account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: unknown) {
    return this.service.create(user.id, validateCreate(body));
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ) {
    return this.service.update(user.id, id, validateUpdate(body));
  }

  @Patch(':id/primary')
  setPrimary(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.setPrimary(user.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(user.id, id);
  }
}
