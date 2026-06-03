import { Module } from '@nestjs/common';
import { ConsentsController } from './consents.controller';
import { ConsentsRepository } from './consents.repository';
import { ConsentsService } from './consents.service';

@Module({
  controllers: [ConsentsController],
  providers: [ConsentsService, ConsentsRepository],
  exports: [ConsentsService],
})
export class ConsentsModule {}
