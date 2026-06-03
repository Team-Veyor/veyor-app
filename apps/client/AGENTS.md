# @veyor/client — 프론트엔드 작업 지침

Next.js 16 + React 19 기반 프론트엔드. PWA 성격의 클라이언트 앱과 Storybook 기반 UI 컴포넌트를 관리합니다.
(루트 지도는 `/AGENTS.md` 참고)

---

## 폴더 구조

```
apps/client/
├── src/
│   ├── app/          # App Router: 라우팅, 레이아웃, 메타데이터, PWA manifest
│   ├── components/   # 재사용 UI 컴포넌트 (컴포넌트 1개 = 폴더 1개)
│   ├── styles/       # 전역 스타일 (globals.css의 @theme token·base·utility)
│   ├── assets/       # 코드에서 import 하는 SVG 등 코드형 에셋
│   ├── lib/          # 도메인 무관 프론트 유틸 (예: cn())
│   ├── stories/      # Storybook 전역 문서(MDX)
│   └── types/        # 프론트 전용 공통 타입
├── public/           # 정적 파일·폰트
├── .storybook/       # Storybook 설정
├── next.config.ts    # Next 설정, 보안 헤더, shared transpile
└── open-next.config.ts
```

### 어디에 코드를 둘지

| 폴더 | 들어가는 것 | 판단 질문 |
| --- | --- | --- |
| `app/` | 라우팅, 레이아웃, 페이지, 메타데이터, PWA manifest | "Next.js App Router의 화면/전역 설정인가?" |
| `components/` | 여러 화면에서 재사용되는 UI 컴포넌트 | "Storybook으로 상태를 확인할 수 있는 UI인가?" |
| `styles/` | `globals.css`의 Tailwind `@theme` token, base, utility | "전역에서 공유되는 디자인 token/스타일인가?" |
| `assets/` | React 컴포넌트로 import 하는 SVG 등 | "코드에서 import해서 색·크기를 props로 제어하는가?" |
| `lib/` | 도메인 무관 순수 유틸 | "두 곳 이상에서 실제로 재사용되는가?" |
| `types/` | 여러 컴포넌트가 공유하는 client 전용 타입 | "한 컴포넌트 안에서만 쓰지 않는가?" |
| `public/` | 정적 파일 (폰트, PWA 아이콘, 이미지) | "URL이나 정적 파일로 제공해야 하는가?" |
| `packages/shared` | client/server가 함께 쓰는 타입·상수 | "서버와 공유해야 하는가?" |

> 원칙: 화면은 `app/`, 재사용 UI는 `components/`, 순수 도구는 `lib/`로 분리. 컴포넌트는 자기완결적으로 유지하고 Storybook으로 상태를 확인합니다.

> 라우트·페이지·메타데이터·PWA manifest 같은 App Router 작업은 `src/app/AGENTS.md`를 먼저 읽고 따릅니다.

---

## UI 작성 흐름

```
Page(app) → Component(components) → Utility(lib/types/assets) → Design Token(styles/globals.css)
                         ↑ Storybook stories로 상태·변형 검증
```

- **Page / Layout**: 라우팅·조합·메타데이터 담당. 재사용 가능한 UI 로직을 직접 쌓지 않습니다.
- **Component**: props로 변형을 제어하고 스타일은 Tailwind class + `cn()`으로 합성합니다.
- **Storybook**: 새 컴포넌트나 주요 변형을 추가하면 `.stories.tsx`로 사용 예시를 남깁니다.

---

## 컴포넌트 작업 규칙

### 폴더 레이아웃

```
components/<ComponentName>/
├── <ComponentName>.tsx         # 컴포넌트 구현
└── <ComponentName>.stories.tsx # Storybook 사용 예시·상태 검증
```

복합 컴포넌트는 같은 폴더에 파생 컴포넌트를 함께 둡니다.

```
components/Modal/
├── Modal.tsx
├── ConfirmModal.tsx
├── WarningModal.tsx
└── Modal.stories.tsx
```

### 새 컴포넌트 추가 절차

1. `src/components/<ComponentName>/` 생성 → `<ComponentName>.tsx` 작성.
2. 표준 DOM 속성을 받을 수 있으면 `ButtonHTMLAttributes`, `InputHTMLAttributes`처럼 React 타입을 확장합니다.
3. 스타일 변형은 `const THEME_CLASSES` / `SIZE_CLASSES`처럼 명시적 map으로 둡니다.
4. Tailwind class는 `cn(base, variant, size, className)` 순서로 합성합니다.
5. 접근성 속성(`type`, `aria-*`, `role`, focus-visible 등)을 컴포넌트 책임에 맞게 포함합니다.
6. 상호작용·브라우저 API가 필요한 파일에만 `'use client'`를 선언합니다.
7. `<ComponentName>.stories.tsx`에 기본/변형/상태 예시를 추가합니다.
8. `pnpm --filter @veyor/client typecheck` & `pnpm check` 실행.

### 설계 규칙

- `className`은 최종 override 지점. 추가 wrapper가 있으면 `wrapperClassName`처럼 대상이 드러나게 합니다.
- 색상은 `text-gray-*`, `bg-brand`처럼 `styles/globals.css`의 token을 우선 사용합니다.
- 크기·간격은 기존 컴포넌트의 rounded/padding 패턴을 먼저 맞춥니다.
- 아이콘은 `assets/icons`의 컴포넌트를 import 하고, 색상은 `className`의 `text-*`로 제어합니다.
- 컴포넌트 안에 도메인 API 호출이나 서버 상태 처리를 넣지 않습니다. 화면에서 주입받은 props/callback으로 동작하게 합니다.
- props 타입은 `<ComponentName>Props`로 명명하고 컴포넌트 파일 안에 둡니다.

---

## 네이밍 / 가독성

이름은 "코드를 읽는 사람"을 위한 1차 문서입니다. 약어보다 의미가 드러나는 이름을 우선합니다.

### 파일 / 폴더

- 컴포넌트 폴더와 파일은 `PascalCase` (`Button/Button.tsx`, `BottomSheet/AgreementBottomSheet.tsx`).
- 폴더와 메인 파일은 같은 이름을 사용합니다.
- 파생 컴포넌트는 메인 컴포넌트 이름을 접미사로 유지합니다 (`Modal` → `ConfirmModal`, `WarningModal`).
- 비컴포넌트 모듈(`lib/`, `types/`, 설정 파일 등)은 `kebab-case` 또는 `camelCase`로 통일합니다. 기존 폴더의 컨벤션을 우선합니다.
- Storybook 파일은 `<Component>.stories.tsx`, 문서는 `<Topic>.mdx` (`Foundation/Color`, `Foundation/Typography`).
- 한 파일에는 가능한 한 하나의 주제만 둡니다. 파일명이 내용과 일치하지 않으면 분리합니다.

### 식별자

- 변수·함수: `camelCase`. 타입·컴포넌트·enum: `PascalCase`. 상수 맵/토큰: `UPPER_SNAKE_CASE` (예: `THEME_CLASSES`, `SIZE_CLASSES`).
- boolean은 `is`, `has`, `should`, `can` 접두어로 상태를 드러냅니다 (`isOpen`, `hasError`, `shouldAutoFocus`).
- 이벤트 핸들러는 prop은 `onAction`, 내부 함수는 `handleAction` (`onClose`, `handleSubmit`).
- 비동기 함수는 동작을 동사로 시작합니다 (`fetchAccounts`, `loadProfile`). 단순 getter는 `get*` 사용을 피하고 명사로 표현합니다.

### 컴포넌트 props

- 변형은 의미 기반 union으로 표현합니다 (`theme: 'dark' | 'brand' | 'light' | 'gray'`, `size: 'small' | 'medium' | 'large'`).
- 콜백 prop은 `on<Event>` 패턴 (`onSubmit`, `onItemExpand`). 데이터 prop과 콜백 prop을 섞지 않습니다.
- 외부에 노출하는 prop은 컴포넌트 책임 범위 안에서만 정의하고, 도메인 상태나 서버 응답 타입을 그대로 받지 않습니다.
- Storybook 스토리 이름은 변형/상태가 드러나도록 짓습니다 (`Dark`, `Brand`, `Large`, `Disabled`).

### 가독성

- 약어는 사전적으로 정착된 것만 사용합니다 (`url`, `id`, `api`). 임의 축약(`btn`, `cmp`, `msg`)은 지양합니다.
- 부정형 boolean은 피합니다 (`isDisabled` O, `isNotEnabled` X).
- 이름이 길어지더라도 의미가 드러나는 쪽을 택합니다. 단, 같은 스코프에서 같은 prefix가 3회 이상 반복되면 함수나 변수를 분리합니다.
- 분기/매직 넘버는 상수로 끌어올려 이름으로 의도를 설명합니다.
- 주석은 "왜"를 적습니다. 이름으로 충분히 설명되는 코드에는 주석을 달지 않습니다.
- 한 함수/컴포넌트가 두 가지 책임을 가지면 이름이 어색해집니다. 이때는 이름을 고치기 전에 분리부터 고려합니다.

---

## 그 외 규칙

- Next.js API/파일 규칙을 다루기 전에는 루트 `AGENTS.md`의 지침에 따라 현재 버전 문서를 확인합니다.
- `@/*` alias는 `apps/client/src/*`를 가리킵니다.
- `@veyor/shared`는 `next.config.ts`의 `transpilePackages`에 포함되어 있으므로 공유 타입·상수 import에 사용합니다.
- Tailwind CSS 4 token은 `src/styles/globals.css`의 `@theme` / `@utility`를 우선합니다.
- 서버 비밀값·Supabase secret key는 클라이언트 코드에 노출하지 않습니다.
- API 요청/응답처럼 서버와 공유해야 하는 타입은 `packages/shared`로 이동합니다.
- `lib/`로 승격할 때는 최소 2곳 이상에서 실제 재사용되는지 확인합니다.
- SVG는 가능하면 `currentColor`를 사용해 부모의 `text-*`로 색을 제어합니다.

---

## 검증

```bash
pnpm dev:client
pnpm storybook
pnpm --filter @veyor/client typecheck
pnpm check
pnpm build:client
```
