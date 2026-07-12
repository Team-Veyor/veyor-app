# 유료 모집 인원 제거 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `paid_recruit_count`가 어드민, 앱, 서버, 공유 계약, DB 어디에서도 설문 응답이나 운영 입력에 사용되지 않게 제거하고 운영 환경에 반영한다.

**Architecture:** 기존 완료 제한 데이터 흐름은 제거한 상태를 유지하고, 어드민 필드 정의와 클라이언트 오류 계약을 함께 정리한다. 이미 적용된 DB 마이그레이션은 수정하지 않고 새 마이그레이션으로 `survey_intakes.paid_recruit_count`를 삭제한다.

**Tech Stack:** Next.js 16, NestJS 11, TypeScript, Supabase PostgreSQL, Cloudflare Workers, Railway

## Global Constraints

- 기존 사용자 변경 파일을 덮어쓰거나 커밋에 포함하지 않는다.
- 적용된 과거 마이그레이션은 수정하지 않는다.
- 비밀값을 출력하지 않는다.
- 운영 DB 변경은 새 마이그레이션의 단일 컬럼 DROP으로 제한한다.

---

### Task 1: 어드민 유료 모집 필드 제거

**Files:**
- Modify: `/Users/bumshik.park/Documents/git/veyor-admin/src/lib/survey-fields.ts`

**Interfaces:**
- Consumes: `SurveyIntakeRow`, `INTAKE_FIELDS`, `TABLE_COLUMNS`
- Produces: `paid_recruit_count`가 없는 접수·관리 폼 계약

- [ ] `paid_recruit_count` 타입, 컬럼 목록, 접수 필드, 관리표 필드를 제거한다.
- [ ] `pnpm typecheck`와 `pnpm exec biome check src/lib/survey-fields.ts`를 실행한다.

### Task 2: 앱·서버 계약과 회귀 테스트 정리

**Files:**
- Modify: `/Users/bumshik.park/Documents/git/veyor-app/packages/shared/src/index.ts`
- Modify: `/Users/bumshik.park/Documents/git/veyor-app/apps/client/src/lib/amplitude.ts`
- Modify: `/Users/bumshik.park/Documents/git/veyor-app/apps/client/src/app/surveys/[surveyId]/complete/page.tsx`
- Modify: `/Users/bumshik.park/Documents/git/veyor-app/apps/server/test/e2e.mjs`
- Keep: 서버 완료 제한 제거 파일 4개

**Interfaces:**
- Consumes: `SurveyCompleteFailureReason`, 완료 API 오류 매핑
- Produces: `target_response_count`가 없는 클라이언트·서버 오류 계약

- [ ] `target_response_count` 공유 타입, 화면 문구, 분석 이벤트 분기를 제거한다.
- [ ] E2E에서 정원 전용 사용자·설문·컬럼 시드를 제거하고 일반 완료 성공 검증만 유지한다.
- [ ] 서버 E2E, 앱/서버 타입 검사, 변경 파일 Biome 검사를 실행한다.

### Task 3: DB 컬럼 제거 마이그레이션

**Files:**
- Create: `/Users/bumshik.park/Documents/git/veyor-app/apps/server/supabase/migrations/20260712194000_drop_paid_recruit_count.sql`

**Interfaces:**
- Consumes: `public.survey_intakes.paid_recruit_count`
- Produces: 해당 컬럼이 없는 운영 DB 스키마

- [ ] `alter table public.survey_intakes drop column if exists paid_recruit_count;` 마이그레이션을 추가한다.
- [ ] Supabase 연결 상태와 대상 프로젝트를 확인한 뒤 마이그레이션을 적용한다.
- [ ] 읽기 전용 스키마 조회로 컬럼 삭제를 확인한다.

### Task 4: 저장소별 반영

**Files:**
- Modify only files listed in Tasks 1–3.

**Interfaces:**
- Consumes: 검증 완료된 두 저장소의 변경사항
- Produces: 배포 가능한 커밋과 운영 배포

- [ ] 각 저장소에서 사용자 변경과 작업 변경을 분리해 스테이징한다.
- [ ] 저장소 규칙과 배포 연결 상태를 확인한다.
- [ ] 작업 파일만 커밋하고 원격 브랜치에 푸시한다.
- [ ] Railway/Cloudflare 배포를 실행하고 헬스 체크 및 화면/API 상태를 확인한다.
