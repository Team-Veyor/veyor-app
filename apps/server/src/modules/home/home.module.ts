import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { ParticipationsModule } from '../participations/participations.module';
import { SurveysModule } from '../surveys/surveys.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [AccountsModule, SurveysModule, ParticipationsModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
