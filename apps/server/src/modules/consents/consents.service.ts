import { BadRequestException, Injectable } from '@nestjs/common';
import { ConsentsRepository } from './consents.repository';

export const CONSENT_TYPES = ['privacy', 'terms', 'marketing'] as const;
export type ConsentType = (typeof CONSENT_TYPES)[number];
const REQUIRED: ConsentType[] = ['privacy', 'terms'];

export interface ConsentView {
  type: ConsentType;
  agreed: boolean;
  agreedAt: string | null;
}

@Injectable()
export class ConsentsService {
  constructor(private readonly repo: ConsentsRepository) {}

  /** 항상 3개 타입을 반환(없으면 기본 false). */
  async list(userId: string): Promise<ConsentView[]> {
    const rows = await this.repo.listByUser(userId);
    const byType = new Map(rows.map((r) => [r.type, r]));
    return CONSENT_TYPES.map((type) => {
      const r = byType.get(type);
      return { type, agreed: r?.agreed ?? false, agreedAt: r?.agreed_at ?? null };
    });
  }

  /** 여러 동의 항목 설정. 필수 약관(privacy/terms)은 false로 철회 불가. */
  async setMany(
    userId: string,
    input: Partial<Record<ConsentType, boolean>>,
    now: Date = new Date(),
  ): Promise<ConsentView[]> {
    const entries = Object.entries(input) as [string, unknown][];
    if (entries.length === 0) {
      throw new BadRequestException('변경할 동의 항목이 없습니다.');
    }
    const items: { type: string; agreed: boolean; agreed_at: string | null }[] = [];
    for (const [type, value] of entries) {
      if (!CONSENT_TYPES.includes(type as ConsentType)) {
        throw new BadRequestException(`알 수 없는 동의 항목: ${type}`);
      }
      if (typeof value !== 'boolean') {
        throw new BadRequestException(`${type} 값은 boolean이어야 합니다.`);
      }
      if (!value && REQUIRED.includes(type as ConsentType)) {
        throw new BadRequestException('필수 약관은 철회할 수 없습니다.');
      }
      items.push({ type, agreed: value, agreed_at: value ? now.toISOString() : null });
    }
    await this.repo.upsertMany(userId, items);
    return this.list(userId);
  }

  /** 온보딩 시 필수 약관 동의 검증. */
  assertRequiredAgreed(input: Partial<Record<ConsentType, boolean>>): void {
    if (!input.privacy || !input.terms) {
      throw new BadRequestException('필수 약관에 모두 동의해야 합니다.');
    }
  }
}
