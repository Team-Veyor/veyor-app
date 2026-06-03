import { Module } from '@nestjs/common';
import { ParticipationsModule } from '../participations/participations.module';
import { SurveysController } from './surveys.controller';
import { SurveysRepository } from './surveys.repository';
import { SurveysService } from './surveys.service';

@Module({
  imports: [ParticipationsModule],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
  exports: [SurveysService],
})
export class SurveysModule {}
