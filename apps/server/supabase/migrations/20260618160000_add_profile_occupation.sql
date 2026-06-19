-- 사용자 프로필 직업 필드 추가 (설문 타깃 직업 매칭용)
-- 중학생/고등학생/대학생/직장인/무직/주부/기타. null = 미입력
alter table public.profiles
  add column if not exists occupation text;

comment on column public.profiles.occupation is '사용자 직업(중학생/고등학생/대학생/직장인/무직/주부/기타). null=미입력';
