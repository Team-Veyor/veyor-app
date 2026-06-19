-- surveys 테이블 분리 (Contract 단계): 구 접수/운영 컬럼 제거.
-- 데이터는 survey_intakes / survey_operations 에 1:1 보존됨(값 단위 무손실 검증 완료).
-- 소비자 앱(veyor-app)은 surveys 잔존 컬럼만 조회하므로 영향 없음.
alter table public.surveys
  drop column if exists topic,
  drop column if exists target_description,
  drop column if exists deadline,
  drop column if exists requested_publish_date,
  drop column if exists suggested_amount,
  drop column if exists contact,
  drop column if exists target_respondents,
  drop column if exists interview_consent,
  drop column if exists reward_budget,
  drop column if exists paid_recruit_count,
  drop column if exists pre_contact_done,
  drop column if exists pre_contact_reply,
  drop column if exists post_contact_done,
  drop column if exists post_contact_reply,
  drop column if exists settlement_status,
  drop column if exists collected_responses,
  drop column if exists admin_note;
