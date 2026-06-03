# app/ — Next.js App Router

라우팅, 전역 레이아웃, 메타데이터, PWA manifest, 그리고 라우트별 페이지 조합이 모이는 곳입니다.
(상위 규칙은 `apps/client/AGENTS.md`, 루트 지도는 `/AGENTS.md` 참고)

---

## 들어가는 것 / 들어가지 않는 것

**들어가는 것**
- App Router의 route segment, `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- `metadata`, `viewport`, `manifest.ts` 등 앱 전역 메타 정보
- 전역 스타일 import 지점 (`layout.tsx`에서 `@/styles/globals.css` import)
- 라우트 트리에 직접 묶인 Provider 조합 (`providers.tsx`)

**들어가지 않는 것**
- 재사용 UI 컴포넌트 → `src/components/`
- 도메인 무관 유틸 → `src/lib/`
- 정적 파일(폰트, PWA 아이콘, 이미지) → `apps/client/public/`
- import해서 색·크기를 props로 제어하는 SVG → `src/assets/icons/`
- 전역 token/utility CSS → `src/styles/globals.css`

---

## 현재 구성

| 경로 | 역할 |
| --- | --- |
| `layout.tsx` | 루트 레이아웃, SUIT 로컬 폰트, `metadata`, `viewport`, `<html lang='ko'>`, 전역 스타일 import, Providers 주입 |
| `page.tsx` | 홈 화면 진입점 |
| `providers.tsx` | 라우트 트리에 주입하는 Provider 묶음 |
| `manifest.ts` | PWA manifest (Next 메타데이터 API) |
| `login/` | 로그인 라우트 (`page.tsx` + route-local `_apis`, `_hooks`) |
| `auth/callback/` | 인증 콜백 라우트 |

---

## 라우트 폴더 컨벤션

라우트 단일 화면에서만 쓰는 API 호출, 훅 등은 **route-local 폴더**(`_apis/`, `_hooks/`)에 둡니다. Next.js의 `_` 접두어는 해당 폴더를 route segment에서 제외하므로 라우팅에 영향을 주지 않습니다.

```
app/<route>/
├── page.tsx
├── _apis/        # 이 라우트에서만 호출하는 API 함수
└── _hooks/       # 이 라우트에서만 쓰는 훅 (mutation, query 등)
```

승격 기준:
- 두 라우트 이상에서 실제 재사용되면 → `src/lib/` 또는 도메인 모듈로 끌어올립니다.
- 서버와 공유해야 하는 타입은 → `packages/shared`.

---

## 규칙

- Next.js API/파일 컨벤션을 다루기 전에는 루트 `AGENTS.md`의 지침에 따라 `node_modules/next/dist/docs/`의 현재 버전 문서를 확인합니다. 이 버전은 학습 데이터와 다를 수 있습니다.
- 페이지는 **조합 책임**만 가집니다. 버튼·입력·모달 같은 재사용 UI는 `src/components/`에서 import 합니다.
- 상호작용, state/effect, browser API가 필요한 파일에만 `'use client'`를 선언합니다. 기본은 서버 컴포넌트입니다.
- 메타데이터는 `metadata`/`generateMetadata` export로 표현합니다. `<head>`를 직접 조작하지 않습니다.
- PWA manifest는 `manifest.ts`로 관리합니다. `public/manifest.json`을 따로 두지 않습니다.
- 전역 색상·타이포그래피는 `src/styles/globals.css`의 `@theme` token / utility로 추가하고, 컴포넌트에서는 해당 class를 사용합니다.
- 전역 스타일 import는 루트 `layout.tsx` **한 곳에서만** 합니다.
- 페이지에서 직접 fetch가 필요하면 서버 컴포넌트의 비동기 함수로 처리하고, 클라이언트 mutation은 route-local `_hooks/`에 둡니다.
