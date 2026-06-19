-- 설문 타깃 직업 필드 추가
-- 중학생/고등학생/대학생/직장인/무직/주부/기타. null = 전체(미지정)
alter table public.surveys
  add column if not exists target_occupation text;

comment on column public.surveys.target_occupation is '타깃 직업(중학생/고등학생/대학생/직장인/무직/주부/기타). null=전체';
