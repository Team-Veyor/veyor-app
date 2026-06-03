import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Public } from '../../core/auth/public.decorator';

interface TermDoc {
  slug: string;
  title: string;
  content: string;
  version: string;
  updatedAt: string;
}

// 정적 약관/라이선스 문서. 추후 DB/CMS로 이전 가능.
const TERMS: Record<string, TermDoc> = {
  terms: {
    slug: 'terms',
    title: '서비스 이용약관',
    content: '백설기 서비스 이용약관 내용입니다.',
    version: '1.0',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  privacy: {
    slug: 'privacy',
    title: '개인정보 수집 및 이용 동의',
    content: '개인정보 수집 및 이용에 관한 내용입니다.',
    version: '1.0',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    title: '개인정보처리방침',
    content: '개인정보처리방침 내용입니다.',
    version: '1.0',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  'open-source': {
    slug: 'open-source',
    title: '오픈소스 라이선스',
    content: '오픈소스 라이선스 고지입니다.',
    version: '1.0',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
};

@Controller('terms')
export class TermsController {
  /** GET /terms/:slug — 약관/라이선스 정적 문서 (공개) */
  @Public()
  @Get(':slug')
  get(@Param('slug') slug: string): TermDoc {
    const doc = TERMS[slug];
    if (!doc) {
      throw new NotFoundException('문서를 찾을 수 없습니다.');
    }
    return doc;
  }
}
