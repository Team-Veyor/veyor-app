# @veyor/server — 백엔드 아키텍처

NestJS 11 기반 백엔드. **피처 모듈러 모놀리스** 구조입니다.
(루트 지도는 `/CLAUDE.md` 참고)

---

## 폴더 구조

```
apps/server/
├── src/
│   ├── main.ts               # 부트스트랩 (포트·CORS·전역 파이프/필터 등록)
│   ├── app.module.ts         # 루트 모듈 (core·common·각 도메인 모듈 import)
│   ├── app.controller.ts     # GET /health
│   ├── app.service.ts
│   │
│   ├── core/                 # 앱 전역 인프라 (싱글톤·부트스트랩 성격) → core/CLAUDE.md
│   │   ├── config/           #   환경변수 로딩·검증      → config/CLAUDE.md
│   │   ├── supabase/         #   supabase-js 클라이언트   → supabase/CLAUDE.md
│   │   └── auth/             #   Supabase JWT 검증·카카오 → auth/CLAUDE.md
│   │
│   ├── common/               # 제네릭·도메인 무관 유틸    → common/CLAUDE.md
│   │   ├── filters/          #   exception filter
│   │   ├── guards/           #   범용 guard
│   │   ├── interceptors/     #   logging·transform 등
│   │   ├── pipes/            #   validation pipe 등
│   │   └── decorators/       #   범용 데코레이터
│   │
│   └── modules/              # 도메인 피처 모듈 (핵심 비즈니스) → modules/CLAUDE.md
│       └── <domain>/         #   예: user, vote, reward ...
│
└── supabase/                 # Supabase CLI (스키마·마이그레이션) → supabase/CLAUDE.md
```

### 3계층의 의미 (어디에 코드를 둘지 판단 기준)

| 폴더 | 들어가는 것 | 판단 질문 |
| --- | --- | --- |
| `core/` | 앱이 떠 있는 동안 살아있는 전역 인프라. 대부분 `@Global()` 또는 루트에서 1회 등록. | "비즈니스 도메인이 아니라 *기반 설비*인가?" (DB 연결, 인증, 설정) |
| `common/` | 어느 모듈에서도 import 가능한 **상태 없는** 재사용 유틸. NestJS에 의존하되 도메인엔 무지. | "여러 도메인이 공유하고, 특정 도메인 지식이 없는가?" |
| `modules/` | 실제 비즈니스 기능. 도메인 1개 = 폴더 1개. | "사용자에게 가치를 주는 기능인가?" |

> 원칙: **레이어가 아니라 기능 단위로 묶는다.** 엔티티마다 모듈을 쪼개지 말 것(순환 의존 유발). 모듈은 가능한 자기완결적으로.

---

## 요청 흐름

```
HTTP → Controller (입출력·검증) → Service (비즈니스 로직) → Repository (supabase-js 쿼리) → Supabase
                                       ↑ Guard(인증) · Pipe(검증) · Filter(에러) · Interceptor(로깅)
```

- **Controller**: 라우팅·DTO 검증·직렬화만. 비즈니스 로직 금지.
- **Service**: 도메인 로직. 다른 모듈이 필요하면 그 모듈의 Service를 주입.
- **Repository**: Supabase 접근 캡슐화. Service는 supabase-js를 직접 호출하지 않고 Repository를 통한다.

---

## 새 도메인 모듈 추가 (요약)

상세·파일 템플릿은 `src/modules/CLAUDE.md` 참고. 절차:

1. `src/modules/<domain>/` 생성 → controller·service·repository·module·`dto/` 작성
2. `<domain>.module.ts`에 providers/controllers 등록, 외부 노출이 필요하면 `exports`
3. `app.module.ts`의 `imports`에 `<Domain>Module` 추가
4. 공유가 필요한 요청/응답 타입은 `packages/shared`에 정의 → client와 공유
5. `pnpm --filter @veyor/server typecheck` & `pnpm check`

---

## 검증 / 규칙

```bash
pnpm dev:server                          # watch 실행 (:4000)
pnpm --filter @veyor/server typecheck    # 타입 체크
pnpm check                               # biome lint+format
```

- Biome 규칙은 루트 `biome.json`. 서버는 overrides 적용(`useImportType` off 등). DI 생성자 주입 패턴 유지.
- 환경변수는 코드에서 `process.env` 직접 접근 대신 `core/config`의 설정 서비스 경유(누수·오타 방지).
- 비밀값(Supabase service role key 등)은 절대 커밋 금지. `.env`는 gitignore.
