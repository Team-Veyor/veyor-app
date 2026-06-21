-- 설문 참여 'started' 상태 도입 — 참여 시작 → 완료 인증 무결성
-- 기능 정의: docs/설문-게시-참여인증-기능정의.md
--
-- 흐름: 참여 버튼 → POST /surveys/:id/start (status='started' 선기록)
--       → 외부 설문 → 복귀 → POST /surveys/:id/complete (started→completed 전이 + 리워드)
-- start 기록 없이 complete 직접 호출은 거부(어뷰징 차단).

-- 1) status 체크 제약: 'started' 추가 (기존엔 'completed'만 허용)
alter table public.participations drop constraint if exists participations_status_check;
alter table public.participations
  add constraint participations_status_check check (status in ('started', 'completed'));

-- 2) 기본 상태를 'started'로 (start 시점에 선기록되는 신규 흐름 기준)
alter table public.participations alter column status set default 'started';

-- 3) completed_at: 시작만 한 행은 NULL → nullable + 기본값 제거
--    (기존 완료 행의 값은 보존됨)
alter table public.participations alter column completed_at drop not null;
alter table public.participations alter column completed_at drop default;

-- 4) started_at: 참여 버튼을 누른(시작) 시점
alter table public.participations
  add column if not exists started_at timestamptz not null default now();

comment on column public.participations.status is 'started=참여 시작(버튼 클릭) / completed=완료 인증';
comment on column public.participations.started_at is '참여 시작 시각(start)';
comment on column public.participations.completed_at is '완료 인증 시각(complete). started 상태에서는 NULL.';
