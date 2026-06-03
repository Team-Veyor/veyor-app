# Veyor API 명세 (api-spec)

> NestJS(`apps/server`) REST API 명세. [`기능-정의서.md`](./기능-정의서.md) 기반.
>
> **인증 모델**: 로그인/회원가입은 **Supabase Auth(카카오 OAuth)** 가 처리하며 클라이언트가 직접 수행합니다.
> 따라서 **본 서버에는 로그인 엔드포인트가 없습니다.** 모든 보호 라우트는 클라이언트가 보낸
> Supabase JWT를 검증합니다.

---

## 공통 규약

### Base URL
- 개발: `http://localhost:4000`

### 인증
- 보호 라우트는 헤더 필수:
  ```
  Authorization: Bearer <Supabase JWT>
  ```
- 검증 실패 → `401 Unauthorized`
- 사용자 식별은 JWT의 `sub`(= `auth.users.id`)로 수행. 본문/쿼리로 받은 user_id는 신뢰하지 않음.

### 응답 형식
- 성공: 리소스 JSON 그대로 반환
- 에러(전역 `AllExceptionsFilter`):
  ```json
  { "statusCode": 400, "message": "사유", "error": "Bad Request", "timestamp": "..." }
  ```

### 공통 상태코드
| 코드 | 의미 |
| --- | --- |
| 200 | 성공 |
| 201 | 생성됨 |
| 400 | 잘못된 요청(검증 실패) |
| 401 | 미인증(토큰 없음/만료) |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌(중복 참여 등) |

### 화폐/시간
- 금액: 원(KRW) 정수
- 시간: ISO 8601 (UTC)

---

## 0. 헬스 체크

### `GET /health` `Public`
```json
200 { "status": "ok", "timestamp": "2026-06-03T00:00:00.000Z" }
```

---

## 1. 사용자 / 온보딩 (User)

### `GET /users/me`
내 프로필 + 누적 현황 조회.
```json
200
{
  "id": "uuid",
  "name": "김가온",
  "email": "gaon1117@naver.com",
  "birthYear": 1998,
  "gender": "female",
  "onboarded": true,
  "totalRewardCount": 5,
  "totalRewardAmount": 2500
}
```

### `POST /users/onboarding`
온보딩 정보 저장(정보 입력 + 약관 동의 일괄). 최초 1회.
```json
// Request
{
  "birthYear": 1998,
  "gender": "female",
  "consents": {
    "privacy": true,      // 필수
    "terms": true,        // 필수
    "marketing": false    // 선택
  }
}
```
```json
201 { "onboarded": true }
```
- 필수 약관 미동의 → `400`
- 이미 온보딩 완료 → `409`

### `DELETE /users/me`
회원 탈퇴. 프로필·활동 내역 삭제(복구 불가), Auth 사용자 삭제.
```json
204 No Content
```

---

## 2. 약관 동의 (Consents)

### `GET /consents`
```json
200
[
  { "type": "privacy",   "agreed": true,  "agreedAt": "..." },
  { "type": "terms",     "agreed": true,  "agreedAt": "..." },
  { "type": "marketing", "agreed": false, "agreedAt": null }
]
```

### `PATCH /consents`
서비스 이용 동의 토글(마케팅·개인정보 등).
```json
// Request
{ "marketing": true }
```
```json
200 { "type": "marketing", "agreed": true, "agreedAt": "..." }
```
- 필수 약관(privacy/terms) 철회 시도 → `400`

---

## 3. 홈 (Home)

### `GET /home`
홈 화면 집계(상태 분기에 필요한 데이터 일괄).
```json
200
{
  "accountRegistered": false,         // 계좌 등록 여부 → 상태 A/B 분기
  "todaySurvey": {                     // 없으면 null
    "id": "uuid",
    "title": "데일리 보부상 가방 디자인 설문조사",
    "estMinutes": "2-3",
    "rewardAmount": 300,
    "externalUrl": "https://...",
    "participated": false             // 진행 전/완료 → 상태 B/C
  },
  "streak": {
    "count": 3,                        // 연속 일수 (participations에서 계산)
    "weeklyStatus": ["mon","tue","wed"] // 주간 현황 그래픽용
  },
  "totalRewardCount": 5,
  "totalRewardAmount": 2500
}
```

---

## 4. 설문 / 참여 (Survey & Participation)

### `GET /surveys/today`
오늘 노출 설문 1건(개인화: 연령/성별 타깃 반영). 없으면 `null`.
```json
200
{
  "id": "uuid",
  "title": "데일리 보부상 가방 디자인 설문조사",
  "estMinutes": "2-3",
  "rewardAmount": 300,
  "externalUrl": "https://...",
  "expiresAt": "...",
  "participated": false
}
```

### `POST /surveys/:surveyId/complete`
설문 완료 인증(B-1). 참여 이력 + 리워드 지급 대기 생성.
```json
201
{
  "participationId": "uuid",
  "surveyId": "uuid",
  "status": "completed",
  "reward": { "amount": 300, "status": "pending" }
}
```
| 에러 | 코드 | 메시지 |
| --- | --- | --- |
| 이미 참여한 설문 | 409 | "이미 참여한 설문입니다." |
| 만료된 설문 | 410 | "참여 기간이 지난 설문입니다." |
| 설문 없음 | 404 | - |
| 처리 실패 | 500 | "인증할 수 없습니다. 다시 시도해주세요." |

> 정책: 외부 설문 제출만으로는 완료가 아니며, 이 엔드포인트 호출(= 완료 버튼)까지 해야 참여 인정. 설문당 1회(`UNIQUE(user_id, survey_id)`).

---

## 5. 참여 내역 (Participations)

### `GET /participations?from=2025-10-01&to=2025-10-31`
참여 내역 조회(캘린더/리스트용). 기간 필터(월 단위).
```json
200
{
  "totalCount": 5,
  "totalAmount": 2500,
  "items": [
    {
      "id": "uuid",
      "surveyTitle": "데일리 보부상 가방 디자인 설문조사",
      "completedAt": "2026-06-01T00:00:00Z",
      "rewardAmount": 300,
      "rewardStatus": "paid"
    }
  ]
}
```

---

## 6. 계좌 관리 (Accounts)

### `GET /accounts/banks`
등록 가능한 은행 목록(프론트 드롭다운). 형식 검증의 화이트리스트와 동일.
```json
200 ["NH농협은행", "KB국민은행", "신한은행", "우리은행", "하나은행", "..."]
```

### `GET /accounts`
```json
200
[
  { "id": "uuid", "bank": "KB국민은행", "accountNoMasked": "3333****1234", "holderName": "김가온", "isPrimary": true },
  { "id": "uuid", "bank": "KB국민은행", "accountNoMasked": "3333****5678", "holderName": "김가온", "isPrimary": false }
]
```

### `POST /accounts`
계좌 등록. 첫 계좌는 자동 대표.
```json
// Request
{ "bank": "KB국민은행", "accountNo": "33330000001234", "holderName": "김가온" }
```
```json
201 { "id": "uuid", "bank": "KB국민은행", "accountNoMasked": "3333****1234", "holderName": "김가온", "isPrimary": true }
```
**검증 (무료 형식 검증)**
- 필수값 누락 → `400` "은행·계좌번호·예금주명은 필수입니다."
- `bank`이 화이트리스트(`GET /accounts/banks`)에 없음 → `400` "지원하지 않는 은행입니다."
- `accountNo` 숫자 10~16자리 아님 → `400` "계좌번호는 숫자 10~16자리여야 합니다."
- 같은 은행+계좌번호 중복 등록 → `409` "이미 등록된 계좌입니다."

> ⚠️ 실제 계좌 존재/예금주 일치 검증은 하지 않음(형식 검증만). 실명 확인은 추후 외부 인증(예: 포트원) 연동 필요.

### `PATCH /accounts/:id`
계좌 수정.
```json
// Request (수정 항목만)
{ "bank": "신한은행", "accountNo": "1100000005678", "holderName": "김가온" }
```
```json
200 { ...account }
```

### `PATCH /accounts/:id/primary`
대표 계좌 지정(대표는 1개만, 기존 대표는 자동 해제).
```json
200 { "id": "uuid", "isPrimary": true }
```

### `DELETE /accounts/:id`
계좌 삭제. 대표 계좌 삭제 시 정책 자동 적용.
```json
200
{
  "deleted": true,
  "primaryReassigned": "uuid|null",   // 남은 계좌 1개면 자동 대표 지정된 id
  "needsPrimarySelection": false       // 남은 계좌 2개 이상이면 true (대표 선택 Bottom Sheet)
}
```

---

## 7. 약관/정적 콘텐츠 (Terms)

### `GET /terms/:slug` `Public`
이용약관/개인정보처리방침/오픈소스 라이선스 등 정적 문서.
- `slug`: `terms` | `privacy` | `privacy-policy` | `open-source`
```json
200 { "slug": "terms", "title": "서비스 이용약관", "content": "..." , "version": "1.0", "updatedAt": "..." }
```

---

## 엔드포인트 요약

| Method | Path | 인증 | 기능 ID |
| --- | --- | --- | --- |
| GET | `/health` | Public | - |
| GET | `/users/me` | ✓ | PROFILE-1 |
| POST | `/users/onboarding` | ✓ | ONBOARD-1~2 |
| DELETE | `/users/me` | ✓ | AUTH-5 |
| GET | `/consents` | ✓ | PROFILE-3 |
| PATCH | `/consents` | ✓ | PROFILE-3 |
| GET | `/home` | ✓ | HOME-1~3 |
| GET | `/surveys/today` | ✓ | HOME-1, SURVEY-1 |
| POST | `/surveys/:id/complete` | ✓ | SURVEY-2~3 |
| GET | `/participations` | ✓ | REWARD-4 |
| GET | `/accounts/banks` | ✓ | ACCOUNT-1 |
| GET | `/accounts` | ✓ | ACCOUNT-3 |
| POST | `/accounts` | ✓ | ACCOUNT-1 |
| PATCH | `/accounts/:id` | ✓ | ACCOUNT-4 |
| PATCH | `/accounts/:id/primary` | ✓ | ACCOUNT-6 |
| DELETE | `/accounts/:id` | ✓ | ACCOUNT-5 |
| GET | `/terms/:slug` | Public | PROFILE-4~5 |

> 로그인/로그아웃/자동로그인(AUTH-1~4)은 **Supabase Auth(클라이언트)** 담당으로 서버 API 없음.
> 리워드 실지급(REWARD-2)은 운영 배치(CSV)로 처리 — 앱 API 아님.

---

## 비고

- 모든 보호 라우트는 `SupabaseJwtGuard` + `@CurrentUser()` 적용, 데이터 접근은 RLS로 본인 데이터만 허용.
- 계좌번호는 응답에서 항상 **마스킹**(`accountNoMasked`)만 노출. 원본은 저장 시 암호화.
- DTO 검증은 NestJS Pipe로 수행하며, 본 명세의 요청 스키마가 검증 기준.
</content>
