# Veyor Client — AGENTS.md

> 이 문서는 AI coding agent가 먼저 읽는 **최상위 작업 지도(map)** 입니다.
> 이 agent의 담당 범위는 **client only** 입니다. `apps/server`는 수정하지 않습니다.
> 클라이언트 상세 규칙은 `apps/client/AGENTS.md`에 위임합니다.

---

## 1. 작업 범위

| 경로 | 역할 | 작업 여부 | 상세 문서 |
| --- | --- | --- | --- |
| `apps/client` | Next.js 16 프론트엔드, PWA, Storybook UI | ✅ 주 작업 | `apps/client/AGENTS.md` |
| `packages/shared` | client↔server 공유 타입·상수 | △ client 작업에 필요한 타입 참조/추가 시만 | `packages/shared/src/index.ts` |
| `docs` | 기획·API·Supabase 참고 문서 | 참고 | `docs/*.md` |
| `apps/server` | NestJS 백엔드 | ❌ 수정 금지 | - |

---

## 2. 어디를 봐야 하는가 (Navigation)

| 알고 싶은 것 / 하려는 것 | 먼저 볼 곳 |
| --- | --- |
| 프론트엔드 폴더 구조·작업 규칙·네이밍 | `apps/client/AGENTS.md` |
| client/server 공유 타입·상수 | `packages/shared/src/index.ts` |
| 기획·API·Supabase 참고 | `docs/*.md` |
| PR 본문 작성 규칙 | `.mastracode/skills/fill-pr-template/SKILL.md` |

---

## 3. 핵심 기술 결정 (client)

| 항목 | 결정 | 비고 |
| --- | --- | --- |
| 프레임워크 | Next.js 16 + React 19 | App Router 사용 |
| 스타일 | Tailwind CSS 4 | `src/styles/globals.css` token 우선 |
| UI 문서화 | Storybook 10 | 컴포넌트 상태·변형 검증 |
| 배포 | OpenNext Cloudflare | `open-next.config.ts` |
| 공유 타입 | `@veyor/shared` | `next.config.ts`에서 transpile |
| 코드 품질 | Biome 2.4 | 루트 `biome.json` |

---

## 4. 자주 쓰는 명령어

```bash
# 개발
pnpm dev:client
pnpm storybook

# 검증
pnpm --filter @veyor/client typecheck
pnpm lint
pnpm check

# 빌드
pnpm build:client
pnpm storybook:build
```

---

## 5. 공통 규칙 / 컨벤션

- `CLAUDE.md`가 아니라 **`AGENTS.md`를 agent 작업 지침의 기준**으로 사용합니다.
- 클라이언트 작업 전에는 `apps/client/AGENTS.md`를 먼저 읽고 따릅니다.
- 서버(`apps/server`)는 수정하지 않습니다. API 정보가 필요하면 `docs` 또는 기존 타입만 참고합니다.
- `@/*` alias는 `apps/client/src/*`를 가리킵니다.
- `@veyor/shared`는 client/server가 함께 쓰는 타입·상수에만 사용합니다.
- 포맷/린트는 루트 `biome.json`이 단일 소스입니다.
- 서버 비밀값·Supabase secret key는 클라이언트 코드에 노출하지 않습니다.

---

## 6. Next.js 작업 특별 주의

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
