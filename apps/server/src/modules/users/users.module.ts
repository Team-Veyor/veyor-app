import { Module } from '@nestjs/common';
import { ConsentsModule } from '../consents/consents.module';
import { ParticipationsModule } from '../participations/participations.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ConsentsModule, ParticipationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
