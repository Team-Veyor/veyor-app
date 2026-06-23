-- 설문 승인 상태(surveys.approval_status)에 'no_reply'(회신안함) 추가.
-- 어드민 관리표 자동 정렬(승인 → 대기 → 회신안함 → 반려) 및 운영자 상태 지정에 사용.
-- 소비자 노출 게이트는 approval_status = 'approved' 만 사용하므로 영향 없음.

alter table public.surveys
  drop constraint if exists surveys_approval_status_check;

alter table public.surveys
  add constraint surveys_approval_status_check
  check (approval_status in ('pending', 'approved', 'no_reply', 'rejected'));
