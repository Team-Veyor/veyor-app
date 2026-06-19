-- surveys 테이블 분리 (Expand 단계): 접수 원본 + 운영/정산을 1:1 확장 테이블로 분리.
-- 비파괴 — surveys 구 컬럼은 아직 유지(Contract 단계에서 별도 제거). 라이브 데이터 백필 포함.

-- 1) survey_intakes : 고객 접수 원본 (민감정보 contact/reward_budget 격리)
create table if not exists public.survey_intakes (
  survey_id              uuid primary key references public.surveys(id) on delete cascade,
  topic                  text,
  target_description     text,
  requested_publish_date date,
  deadline               date,
  suggested_amount       integer check (suggested_amount is null or suggested_amount >= 0),
  contact                text,
  target_respondents     integer check (target_respondents is null or target_respondents >= 0),
  interview_consent      boolean,
  reward_budget          text,
  paid_recruit_count     integer check (paid_recruit_count is null or paid_recruit_count >= 0),
  created_at             timestamptz not null default now()
);
comment on table public.survey_intakes is '고객 접수 원본(surveys와 1:1). contact/reward_budget 등 민감정보 격리. service key 전용.';

-- 2) survey_operations : 운영/정산
create table if not exists public.survey_operations (
  survey_id           uuid primary key references public.surveys(id) on delete cascade,
  pre_contact_done    boolean not null default false,
  pre_contact_reply   text,
  post_contact_done   boolean not null default false,
  post_contact_reply  text,
  settlement_status   text not null default 'pending' check (settlement_status in ('pending', 'invoiced', 'paid')),
  collected_responses integer not null default 0 check (collected_responses >= 0),
  admin_note          text,
  updated_at          timestamptz not null default now()
);
comment on table public.survey_operations is '설문 운영/정산(surveys와 1:1). service key 전용.';

-- 3) RLS: 소비자(anon/authenticated) 접근 차단. 정책 미부여 = deny. service key는 우회.
alter table public.survey_intakes enable row level security;
alter table public.survey_operations enable row level security;

-- 4) updated_at 자동 갱신 트리거 (기존 set_updated_at 재사용)
drop trigger if exists trg_survey_operations_updated_at on public.survey_operations;
create trigger trg_survey_operations_updated_at
  before update on public.survey_operations
  for each row execute function public.set_updated_at();

-- 5) 백필: 기존 surveys 17건 → 1:1 row 보장 (값/NULL 그대로 복사)
insert into public.survey_intakes (
  survey_id, topic, target_description, requested_publish_date, deadline,
  suggested_amount, contact, target_respondents, interview_consent, reward_budget,
  paid_recruit_count, created_at
)
select id, topic, target_description, requested_publish_date, deadline,
       suggested_amount, contact, target_respondents, interview_consent, reward_budget,
       paid_recruit_count, created_at
from public.surveys
on conflict (survey_id) do nothing;

insert into public.survey_operations (
  survey_id, pre_contact_done, pre_contact_reply, post_contact_done, post_contact_reply,
  settlement_status, collected_responses, admin_note
)
select id, pre_contact_done, pre_contact_reply, post_contact_done, post_contact_reply,
       settlement_status, collected_responses, admin_note
from public.surveys
on conflict (survey_id) do nothing;
