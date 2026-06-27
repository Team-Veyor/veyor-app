import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../core/supabase/supabase.service';

export interface SurveyRow {
  id: string;
  title: string;
  external_url: string;
  reward_amount: number;
  est_minutes: string | null;
  target_gender: string | null;
  target_birth_year_min: number | null;
  target_birth_year_max: number | null;
  target_occupation: string | null;
  opens_at: string;
  expires_at: string | null;
  is_published: boolean;
  approval_status: string;
  survey_intakes?: SurveyIntakeEmbed | SurveyIntakeEmbed[] | null;
}

export interface SurveyIntakeEmbed {
  topic: string | null;
  suggested_amount: number | null;
}

const SURVEY_COLS =
  'id, title, external_url, reward_amount, est_minutes, target_gender, target_birth_year_min, target_birth_year_max, target_occupation, opens_at, expires_at, is_published, approval_status, survey_intakes(topic, suggested_amount)';

@Injectable()
export class SurveysRepository {
  constructor(private readonly supabase: SupabaseService) {}

  private get db() {
    return this.supabase.admin;
  }

  async findById(id: string): Promise<SurveyRow | null> {
    const { data, error } = await this.db
      .from('surveys')
      .select(SURVEY_COLS)
      .eq('id', id)
      .eq('is_published', true)
      .eq('approval_status', 'approved')
      .maybeSingle();
    if (error) {
      throw new InternalServerErrorException('설문을 불러오지 못했습니다.');
    }
    return (data as SurveyRow) ?? null;
  }

  /**
   * 현재 노출 가능한(게시·승인·기간 내) 설문 후보 목록. 타깃 필터는 호출부(JS)에서.
   * 서버는 secret key(admin)로 RLS를 우회하므로, 노출 게이트(is_published·approval_status)를
   * 여기서 명시적으로 건다. (surveys RLS의 surveys_select_published 와 동일 의미)
   */
  async findOpenCandidates(nowIso: string): Promise<SurveyRow[]> {
    const { data, error } = await this.db
      .from('surveys')
      .select(SURVEY_COLS)
      .eq('is_published', true)
      .eq('approval_status', 'approved')
      .lte('opens_at', nowIso)
      .or(`expires_at.is.null,expires_at.gte.${nowIso}`)
      .order('opens_at', { ascending: false })
      .limit(50);
    if (error) {
      throw new InternalServerErrorException('설문을 불러오지 못했습니다.');
    }
    return (data as SurveyRow[]) ?? [];
  }

  /**
   * 설문의 유료 모집 정원(survey_intakes.paid_recruit_count). 모집 마감 판정의 상한으로 쓴다.
   * 0·음수·미설정(null)은 모두 null(=정원 무제한, 게이트 미적용)로 정규화한다.
   * (게시·승인된 설문인데 정원이 0인 상태는 대개 미입력이므로, 전원 차단보다 게이트 미적용이 안전한 기본값.)
   * survey_intakes는 RLS deny(서비스 키 전용)이지만 서버는 admin 클라이언트로 우회 조회한다.
   */
  async getRecruitLimit(surveyId: string): Promise<number | null> {
    const { data, error } = await this.db
      .from('survey_intakes')
      .select('paid_recruit_count')
      .eq('survey_id', surveyId)
      .maybeSingle();
    if (error) {
      throw new InternalServerErrorException('설문을 불러오지 못했습니다.');
    }
    const limit = (data?.paid_recruit_count as number | null) ?? null;
    return limit != null && limit > 0 ? limit : null;
  }

  async getProfileTarget(
    userId: string,
  ): Promise<{ birth_year: number | null; gender: string | null; occupation: string | null }> {
    const { data } = await this.db
      .from('profiles')
      .select('birth_year, gender, occupation')
      .eq('id', userId)
      .maybeSingle();
    return {
      birth_year: data?.birth_year ?? null,
      gender: data?.gender ?? null,
      occupation: data?.occupation ?? null,
    };
  }
}
