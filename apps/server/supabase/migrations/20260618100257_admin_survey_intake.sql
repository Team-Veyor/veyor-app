-- 어드민(veyor-admin) 설문 접수·승인·정산 워크플로 지원
-- surveys 테이블 확장: 고객 공개 접수 폼 항목 + 운영자 관리 항목(승인/게시/정산) 일체.
-- 기반: veyor-admin 어드민 (① 설문 수기 등록 ② 공개 접수 폼 ③ 관리 테이블)
-- 주의: 기존 마이그레이션 파일은 수정 금지. 본 파일은 추가 변경분(append-only).

-- ============================================================
-- 1. surveys 컬럼 확장
-- ============================================================

-- (A) 워크플로 상태 --------------------------------------------------------
alter table public.surveys
  add column if not exists approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  add column if not exists is_published boolean not null default false,
  add column if not exists source text not null default 'manual'
    check (source in ('manual', 'intake'));

comment on column public.surveys.approval_status is '승인 여부: pending(대기)/approved(승인)/rejected(반려). approved + is_published 만 앱 노출';
comment on column public.surveys.is_published is '게시여부. approval_status=approved 와 함께 충족해야 앱(오늘의 설문)에 노출';
comment on column public.surveys.source is '등록 출처: manual(운영자 수기 등록) / intake(고객 공개 접수 폼)';

-- (B) 고객(모집자) 공개 접수 폼 입력 항목 ----------------------------------
alter table public.surveys
  add column if not exists topic text,                       -- 주제
  add column if not exists target_description text,          -- 대상(자유서술)
  add column if not exists deadline date,                    -- 설문 마감일
  add column if not exists requested_publish_date date,      -- 게시일(희망)
  add column if not exists suggested_amount integer
    check (suggested_amount is null or suggested_amount >= 0),       -- 적정 금액
  add column if not exists contact text,                     -- 연락처(전화/이메일/카카오 등)
  add column if not exists target_respondents integer
    check (target_respondents is null or target_respondents >= 0),   -- 설문 목표 인원
  add column if not exists interview_consent boolean,        -- 만족도 3분 전화 인터뷰 동의
  add column if not exists reward_budget text,               -- 리워드 예산(서술형, 예: 스타벅스 기프티콘 5명 20,000원)
  add column if not exists paid_recruit_count integer
    check (paid_recruit_count is null or paid_recruit_count >= 0);   -- 유료 모집 인원

-- (C) 운영자 관리 항목 -----------------------------------------------------
alter table public.surveys
  add column if not exists pre_contact_done boolean not null default false,   -- 게시 전 연락
  add column if not exists pre_contact_reply text,                            -- (게시 전) 회신
  add column if not exists post_contact_done boolean not null default false,  -- 게시 후 연락
  add column if not exists post_contact_reply text,                           -- (게시 후) 회신
  add column if not exists settlement_status text not null default 'pending'
    check (settlement_status in ('pending', 'invoiced', 'paid')),             -- 정산
  add column if not exists collected_responses integer not null default 0
    check (collected_responses >= 0),                                         -- 확보 응답 수
  add column if not exists admin_note text,                                   -- 운영 메모
  add column if not exists updated_at timestamptz not null default now();

comment on column public.surveys.settlement_status is '정산 상태: pending(대기)/invoiced(청구)/paid(완료)';
comment on column public.surveys.collected_responses is '확보 응답 수(운영자 집계)';

-- ============================================================
-- 2. 기존 행 백필: 이미 라이브였던 설문은 승인+게시 상태로 보존
--    (본 마이그레이션 적용 시점에 존재하는 모든 행 = 레거시 운영자 등록 설문)
-- ============================================================
update public.surveys
  set approval_status = 'approved',
      is_published    = true,
      source          = 'manual';

-- 참고: intake(접수) insert 시 서버(service key)가 title=주제, external_url=링크,
-- reward_amount=0(승인 시 운영자가 확정)로 채워 NOT NULL 제약을 만족시킨다.

-- ============================================================
-- 3. updated_at 자동 갱신 트리거 (set_updated_at 은 초기 마이그레이션에 정의됨)
-- ============================================================
drop trigger if exists trg_surveys_updated_at on public.surveys;
create trigger trg_surveys_updated_at
  before update on public.surveys
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. RLS: authenticated 읽기를 '승인+게시' 행으로 제한
--    기존 정책(surveys_select_authenticated, using(true))을 교체.
--    앱 서버는 service key 로 읽으므로 영향 없음. 향후 publishable key 로
--    클라이언트가 직접 조회하더라도 미승인/접수 데이터·민감정보(연락처/예산/정산)
--    노출을 차단한다.
-- ============================================================
drop policy if exists "surveys_select_authenticated" on public.surveys;
drop policy if exists "surveys_select_published" on public.surveys;
create policy "surveys_select_published" on public.surveys
  for select to authenticated
  using (approval_status = 'approved' and is_published = true);

-- 워크플로/노출 조회 인덱스
create index if not exists idx_surveys_approval on public.surveys (approval_status, is_published);
create index if not exists idx_surveys_source on public.surveys (source, created_at desc);
