# Veyor (백설기) — CLAUDE.md

> 이 문서는 저장소의 **지도(map)** 입니다.
> "무엇을 하려면 / 무엇을 알려면 **어디를 봐야 하는가**"를 먼저 여기서 찾으세요.
> 작업자는 **백엔드** 담당이므로 이 문서와 하위 문서는 `apps/server`(NestJS) 중심으로 정리되어 있습니다.

---

## 1. 저장소 한눈에 보기

pnpm 모노레포입니다 (pnpm 10.x · Node ≥ 20).

| 경로 | 패키지 | 역할 | 내 작업 영역? |
| --- | --- | --- | --- |
| `apps/server` | `@veyor/server` | **NestJS 11 백엔드** | ✅ 주 작업 |
| `apps/client` | `@veyor/client` | Next.js 16 프론트엔드 (PWA) | ❌ 참고만, 직접 수정 X |
| `packages/shared` | `@veyor/shared` | client↔server 공유 타입 | △ 타입 추가 시만 |

---

## 2. 어디를 봐야 하는가 (Navigation)

작업/질문별로 먼저 열어야 할 문서·파일입니다. **백엔드 상세 규칙은 `apps/server/CLAUDE.md`에 있습니다.**

| 알고 싶은 것 / 하려는 것 | 봐야 할 곳 |
| --- | --- |
| 백엔드 전체 아키텍처·규칙·모듈 추가법 | `apps/server/CLAUDE.md` |
| 새 도메인 기능(모듈) 추가 | `apps/server/src/modules/CLAUDE.md` |
| 앱 전역 인프라(부트스트랩 성격) 개요 | `apps/server/src/core/CLAUDE.md` |
| Supabase DB 접근 (`supabase-js`) | `apps/server/src/core/supabase/CLAUDE.md` |
| 카카오 로그인 / 인증·인가(JWT 검증) | `apps/server/src/core/auth/CLAUDE.md` |
| 환경변수·설정 로딩/검증 | `apps/server/src/core/config/CLAUDE.md` |
| 공통 유틸(필터·가드·파이프·인터셉터) | `apps/server/src/common/CLAUDE.md` |
| DB 스키마·마이그레이션 (Supabase CLI) | `apps/server/supabase/CLAUDE.md` |
| client↔server 공유 타입 | `packages/shared/src/index.ts` |
| 코드 스타일·린트·포맷 규칙 | `biome.json` |
| PR 본문 작성 규칙(한국어 템플릿) | `.mastracode/skills/fill-pr-template/SKILL.md` |
| 프론트엔드(Next.js 16) 작업 주의사항 | `AGENTS.md` (⚠️ **프론트 전용** 규칙) |

---

## 3. 핵심 기술 결정 (백엔드)

| 항목 | 결정 | 비고 |
| --- | --- | --- |
| 프레임워크 | NestJS 11 (Express 5) | |
| 아키텍처 | **피처 모듈러 모놀리스** | 도메인별 모듈 + `core` + `common` |
| DB 접근 | **`@supabase/supabase-js` 클라이언트** | ORM 미사용. `core/supabase`의 래퍼 경유 |
| 인증 | **Supabase Auth + 카카오 OAuth** | 로그인은 Supabase가 담당, NestJS는 **JWT 검증만** |
| 마이그레이션 | **Supabase CLI** | `apps/server/supabase/migrations` |
| 코드 품질 | Biome 2.4 | lint + format + organize imports |

---

## 4. 자주 쓰는 명령어

```bash
# 개발
pnpm dev              # client + server 동시 실행
pnpm dev:server       # 백엔드만 (NestJS, http://localhost:4000)

# 검증 (커밋/PR 전 권장)
pnpm --filter @veyor/server typecheck
pnpm lint             # biome lint
pnpm check            # biome check --write (lint+format+import 정리)

# 빌드
pnpm build:server
```

헬스 체크: `GET http://localhost:4000/health` → `{ status, timestamp }`

---

## 5. 규칙 / 컨벤션 (요약)

- **포맷/린트는 Biome**가 단일 소스. 들여쓰기 space 2, 폭 100, 작은따옴표, 세미콜론 필수. 커밋 전 `pnpm check`.
- 서버 코드에는 `useImportType`·`noUselessConstructor` 규칙이 꺼져 있음(`biome.json` overrides) — NestJS DI 패턴 때문. `any`는 경고.
- `console`은 `warn`/`error`만 허용. 그 외엔 명시적 `// biome-ignore` 필요(예: `main.ts` 부트스트랩 로그).
- 커밋·이슈·PR은 한국어. 커밋 prefix: `feat` / `fix` / `chore` / `style` 등. PR은 fill-pr-template 스킬 사용.
- **하위 폴더마다 `CLAUDE.md`가 있다.** 해당 영역에서 작업할 땐 그 문서를 먼저 읽고 컨벤션을 따른다.

---

## 6. 참고 자료 (외부)

- NestJS 공식 문서: https://docs.nestjs.com
- Supabase (Auth/CLI/JS): https://supabase.com/docs
- Supabase 카카오 OAuth: https://supabase.com/docs/guides/auth/social-login/auth-kakao
- Biome: https://biomejs.dev
- 구조 베스트 프랙티스: feature-by-module(레이어가 아닌 **기능 단위**로 묶기), `core`/`common`/`modules` 3계층 분리. 자세한 근거는 `apps/server/CLAUDE.md` 참고.
