import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { ParticipationsModule } from '../participations/participations.module';
import { SurveysController } from './surveys.controller';
import { SurveysRepository } from './surveys.repository';
import { SurveysService } from './surveys.service';

@Module({
  imports: [AccountsModule, ParticipationsModule],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
  exports: [SurveysService],
})
export class SurveysModule {}
