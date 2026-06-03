import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConsentsService } from '../consents/consents.service';
import { ParticipationsService } from '../participations/participations.service';
import type { OnboardingDto } from './dto/onboarding.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly consents: ConsentsService,
    private readonly participations: ParticipationsService,
  ) {}

  async getMe(userId: string) {
    const profile = await this.repo.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }
    const totals = await this.participations.getTotals(userId);
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      birthYear: profile.birth_year,
      gender: profile.gender,
      onboarded: profile.onboarded_at != null,
      totalRewardCount: totals.count,
      totalRewardAmount: totals.amount,
    };
  }

  async onboarding(userId: string, dto: OnboardingDto) {
    const profile = await this.repo.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }
    if (profile.onboarded_at) {
      throw new ConflictException('이미 온보딩을 완료했습니다.');
    }
    this.consents.assertRequiredAgreed(dto.consents);

    await this.repo.updateProfile(userId, {
      birth_year: dto.birthYear,
      gender: dto.gender,
      onboarded_at: new Date().toISOString(),
    });
    await this.consents.setMany(userId, {
      privacy: dto.consents.privacy,
      terms: dto.consents.terms,
      marketing: dto.consents.marketing ?? false,
    });

    return { onboarded: true };
  }

  async deleteMe(userId: string): Promise<void> {
    await this.repo.deleteAuthUser(userId);
  }
}
