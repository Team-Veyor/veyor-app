import { Module } from '@nestjs/common';
import { ParticipationsController } from './participations.controller';
import { ParticipationsRepository } from './participations.repository';
import { ParticipationsService } from './participations.service';

@Module({
  controllers: [ParticipationsController],
  providers: [ParticipationsService, ParticipationsRepository],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
