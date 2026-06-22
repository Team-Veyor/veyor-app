-- 직업(occupation) 저장값을 한글 → 영문 코드로 전환.
-- 코드 집합: school_student, college_student, graduate_student, job_seeker,
--   office_worker, freelancer, self_employed, homemaker, unemployed, retired, other
-- CHECK 제약은 없음(검증은 앱 레이어). 본 마이그레이션은 기존 값 백필 + 컬럼 주석 갱신.
-- 참고: 기존 '중학생'·'고등학생'은 'school_student'로 병합.

-- 1) 기존 한글 값 백필 (현재 데이터 없음 — 방어적)
update public.profiles
set occupation = case occupation
  when '중학생' then 'school_student'
  when '고등학생' then 'school_student'
  when '대학생' then 'college_student'
  when '직장인' then 'office_worker'
  when '무직' then 'unemployed'
  when '주부' then 'homemaker'
  when '기타' then 'other'
  else occupation
end
where occupation is not null;

update public.surveys
set target_occupation = case target_occupation
  when '중학생' then 'school_student'
  when '고등학생' then 'school_student'
  when '대학생' then 'college_student'
  when '직장인' then 'office_worker'
  when '무직' then 'unemployed'
  when '주부' then 'homemaker'
  when '기타' then 'other'
  else target_occupation
end
where target_occupation is not null;

-- 2) 컬럼 주석 갱신 (새 코드 집합 반영)
comment on column public.profiles.occupation is
  '사용자 직업 코드(school_student/college_student/graduate_student/job_seeker/office_worker/freelancer/self_employed/homemaker/unemployed/retired/other). null=미입력';
comment on column public.surveys.target_occupation is
  '타깃 직업 코드(school_student/college_student/graduate_student/job_seeker/office_worker/freelancer/self_employed/homemaker/unemployed/retired/other). null=전체';
