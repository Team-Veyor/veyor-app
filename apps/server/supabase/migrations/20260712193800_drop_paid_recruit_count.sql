-- 유료 모집 인원은 더 이상 접수 항목이나 설문 완료 제한으로 사용하지 않는다.
alter table public.survey_intakes
  drop column if exists paid_recruit_count;
