-- Veyor 초기 스키마
-- 기반 문서: docs/기능-정의서.md, docs/api-spec.md
-- 인증: Supabase Auth(카카오). 앱 데이터는 auth.users(id)를 참조한다.
-- 모든 테이블 RLS 활성. 사용자는 본인 데이터만 접근. surveys는 인증 사용자 읽기 허용.

-- ============================================================
-- 공통: updated_at 자동 갱신 트리거 함수
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 1. profiles — 앱 사용자 프로필 (auth.users 1:1)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  name         text,
  email        text,
  birth_year   smallint check (birth_year between 1900 and 2100),
  gender       text check (gender in ('male', 'female')),
  onboarded_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);
comment on table public.profiles is '앱 사용자 프로필 (Supabase Auth 사용자와 1:1)';

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 신규 가입 시 프로필 자동 생성 (카카오 메타데이터에서 이름/이메일 추출)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'nickname'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. consents — 약관 동의 이력
-- ============================================================
create table public.consents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null check (type in ('privacy', 'terms', 'marketing')),
  agreed     boolean not null default false,
  agreed_at  timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, type)
);
comment on table public.consents is '약관/마케팅 동의 상태 (privacy·terms 필수, marketing 선택)';

create trigger trg_consents_updated_at
  before update on public.consents
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. accounts — 리워드 입금 계좌
-- ============================================================
create table public.accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  bank        text not null,
  account_no  text not null,            -- 앱 레이어에서 암호화 저장, 응답은 마스킹
  holder_name text not null,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.accounts is '리워드 지급 계좌. 사용자당 대표 계좌 1개';
comment on column public.accounts.account_no is '암호화 저장 대상. 평문 노출 금지';

-- 사용자당 대표 계좌는 1개만
create unique index uq_accounts_one_primary
  on public.accounts (user_id)
  where is_primary;

create index idx_accounts_user on public.accounts (user_id);

create trigger trg_accounts_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. surveys — 설문 (운영자 등록)
-- ============================================================
create table public.surveys (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  external_url          text not null,
  reward_amount         integer not null check (reward_amount >= 0),
  est_minutes           text,                  -- 예: "2-3"
  target_gender         text check (target_gender in ('male', 'female')), -- null = 전체
  target_birth_year_min smallint,
  target_birth_year_max smallint,
  opens_at              timestamptz not null default now(),
  expires_at            timestamptz,
  created_at            timestamptz not null default now()
);
comment on table public.surveys is '노출 설문. target_* 로 연령/성별 개인화';

create index idx_surveys_window on public.surveys (opens_at, expires_at);

-- ============================================================
-- 5. participations — 참여 이력 (설문당 1회)
-- ============================================================
create table public.participations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  survey_id    uuid not null references public.surveys (id) on delete cascade,
  status       text not null default 'completed' check (status in ('completed')),
  completed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (user_id, survey_id)   -- 설문당 1회 참여 (연속/하루1회는 발행/운영 정책)
);
comment on table public.participations is '설문 참여 이력. UNIQUE(user_id, survey_id). 연속 참여(streak)는 completed_at에서 계산';

create index idx_participations_user_completed
  on public.participations (user_id, completed_at desc);

-- ============================================================
-- 6. rewards — 리워드 지급 (참여 1:1)
-- ============================================================
create table public.rewards (
  id               uuid primary key default gen_random_uuid(),
  participation_id uuid not null unique references public.participations (id) on delete cascade,
  user_id          uuid not null references auth.users (id) on delete cascade,
  amount           integer not null check (amount >= 0),
  status           text not null default 'pending' check (status in ('pending', 'paid')),
  paid_at          timestamptz,
  created_at       timestamptz not null default now()
);
comment on table public.rewards is '리워드 지급 레코드. CSV 일괄 정산으로 pending → paid';

create index idx_rewards_user on public.rewards (user_id);
create index idx_rewards_status on public.rewards (status);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.consents       enable row level security;
alter table public.accounts       enable row level security;
alter table public.surveys        enable row level security;
alter table public.participations enable row level security;
alter table public.rewards        enable row level security;

-- profiles: 본인만 조회/수정 (insert는 트리거가 처리)
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- consents: 본인 전체 권한
create policy "consents_all_own" on public.consents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- accounts: 본인 전체 권한
create policy "accounts_all_own" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- surveys: 인증 사용자 읽기 전용 (쓰기는 service key=운영)
create policy "surveys_select_authenticated" on public.surveys
  for select to authenticated using (true);

-- participations: 본인 조회/생성 (수정/삭제 불가 — 이력 보존)
create policy "participations_select_own" on public.participations
  for select using (auth.uid() = user_id);
create policy "participations_insert_own" on public.participations
  for insert with check (auth.uid() = user_id);

-- rewards: 본인 조회 전용 (생성/지급은 service key=서버·운영)
create policy "rewards_select_own" on public.rewards
  for select using (auth.uid() = user_id);
