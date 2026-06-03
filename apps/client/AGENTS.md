# @veyor/client — 프론트엔드 아키텍처

Next.js 16 + React 19 기반 프론트엔드입니다. PWA 성격의 클라이언트 앱과 Storybook 기반 UI 컴포넌트를 관리합니다.
(루트 지도는 `/AGENTS.md` 참고)

---

## 폴더 구조

```
apps/client/
├── src/
│   ├── app/                  # App Router, 전역 레이아웃·메타데이터·스타일 → app/AGENTS.md
│   │   ├── layout.tsx        # 루트 레이아웃, 폰트, metadata, viewport
│   │   ├── manifest.ts       # PWA manifest
│   │   ├── globals.css       # Tailwind CSS 4 theme token·base·utility
│   │   └── page.tsx          # 홈/화면 조합
│   │
│   ├── components/           # 재사용 UI 컴포넌트 → components/AGENTS.md
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── BottomSheet/
│   │   └── Radio/
│   │
│   ├── assets/               # SVG 아이콘 등 코드형 에셋 → assets/AGENTS.md
│   │   └── icons/
│   │
│   ├── lib/                  # 도메인 무관 프론트 유틸 → lib/AGENTS.md
│   ├── stories/              # Storybook 문서(MDX) → stories/AGENTS.md
│   └── types/                # 프론트 전용 공통 타입 → types/AGENTS.md
│
├── public/                   # 정적 파일·폰트
├── .storybook/               # Storybook 설정
├── next.config.ts            # Next 설정, 보안 헤더, shared transpile
└── open-next.config.ts       # Cloudflare 배포 설정
```

---

## 3계층의 의미 (어디에 코드를 둘지 판단 기준)

| 폴더 | 들어가는 것 | 판단 질문 |
| --- | --- | --- |
| `app/` | 라우팅, 레이아웃, 페이지, 메타데이터, 전역 CSS | "Next.js App Router의 화면/전역 설정인가?" |
| `components/` | 여러 화면에서 재사용 가능한 UI 컴포넌트 | "도메인보다 UI 역할이 중심이고 Storybook으로 확인 가능한가?" |
| `lib/`, `types/`, `assets/` | 공통 유틸, 타입, 아이콘/에셋 | "화면·컴포넌트가 공유하지만 자체 UI는 아닌가?" |

> 원칙: 화면은 `app/`, 재사용 UI는 `components/`, 순수 도구는 `lib/`로 분리합니다. 컴포넌트는 가능한 자기완결적으로 유지하고 Storybook으로 상태를 확인합니다.

---

## UI 작성 흐름

```
Page(app) → Component(components) → Utility(lib/types/assets) → Design Token(globals.css)
                         ↑ Storybook stories로 상태·변형 검증
```

- **Page / Layout**: 라우팅·조합·메타데이터 담당. 재사용 가능한 UI 로직을 직접 쌓지 않습니다.
- **Component**: props로 변형을 제어하고, 스타일은 Tailwind class + `cn()`으로 합성합니다.
- **Storybook**: 새 컴포넌트 또는 주요 변형을 추가하면 `.stories.tsx`로 사용 예시를 남깁니다.

---

## 새 UI 컴포넌트 추가 (요약)

상세 규칙은 `src/components/AGENTS.md` 참고.

1. `src/components/<ComponentName>/` 생성 → `<ComponentName>.tsx` 작성
2. props 타입은 컴포넌트 파일 안에 가깝게 두고, 전역 재사용 타입만 `src/types`로 이동
3. 스타일은 `globals.css`의 색상·타이포그래피 token/utility와 `cn()`을 우선 사용
4. 상호작용·브라우저 API가 필요할 때만 파일 상단에 `'use client'` 선언
5. `<ComponentName>.stories.tsx`로 기본/비활성/변형 상태를 검증
6. `pnpm --filter @veyor/client typecheck` & `pnpm check` 실행

---

## 네이밍 / 가독성 규칙

이름은 "코드를 읽는 사람"을 위한 1차 문서입니다. 약어보다 의미가 드러나는 이름을 우선합니다.

### 파일 / 폴더

- 컴포넌트 폴더와 파일은 `PascalCase` (`Button/Button.tsx`, `BottomSheet/AgreementBottomSheet.tsx`).
- 비컴포넌트 모듈(`lib/`, `types/`, 설정 파일 등)은 `kebab-case` 또는 `camelCase`로 통일합니다. 기존 폴더의 컨벤션을 우선합니다.
- Storybook 파일은 `<Component>.stories.tsx`, 문서는 `<Topic>.mdx` (`Foundation/Color`, `Foundation/Typography`).
- 한 파일에는 가능한 한 하나의 주제만 둡니다. 파일명이 내용과 일치하지 않으면 분리합니다.

### 식별자

- 변수·함수: `camelCase`. 타입·컴포넌트·enum: `PascalCase`. 상수 맵/토큰: `UPPER_SNAKE_CASE` (예: `THEME_CLASSES`, `SIZE_CLASSES`).
- boolean은 `is`, `has`, `should`, `can` 접두어로 상태를 드러냅니다 (`isOpen`, `hasError`, `shouldAutoFocus`).
- 이벤트 핸들러는 prop은 `onAction`, 내부 함수는 `handleAction` (`onClose`, `handleSubmit`).
- 비동기 함수는 동작을 동사로 시작합니다 (`fetchAccounts`, `loadProfile`). 단순 getter는 `get*` 사용을 피하고 명사로 표현합니다.
- 약어는 사전적으로 정착된 것만 사용합니다 (`url`, `id`, `api`). 임의 축약(`btn`, `cmp`, `msg`)은 지양합니다.
- 부정형 boolean은 피합니다 (`isDisabled` O, `isNotEnabled` X).

### 컴포넌트 props

- 변형은 의미 기반 union으로 표현합니다 (`theme: 'dark' | 'brand' | 'light' | 'gray'`, `size: 'small' | 'medium' | 'large'`).
- `className`은 최종 override 지점, 추가 wrapper가 있으면 `wrapperClassName`처럼 대상이 드러나게 합니다.
- 콜백 prop은 `on<Event>` 패턴 (`onSubmit`, `onItemExpand`). 데이터 prop과 콜백 prop을 섞지 않습니다.
- 외부에 노출하는 prop은 컴포넌트 책임 범위 안에서만 정의하고, 도메인 상태나 서버 응답 타입을 그대로 받지 않습니다.

### 가독성

- 이름이 길어지더라도 의미가 드러나는 쪽을 택합니다. 다만 같은 스코프에서 같은 prefix가 3회 이상 반복되면 함수나 변수를 분리합니다.
- 분기/매직 넘버는 상수로 끌어올려 이름으로 의도를 설명합니다.
- 주석은 "왜"를 적습니다. 이름으로 충분히 설명되는 코드에는 주석을 달지 않습니다.
- 한 함수/컴포넌트가 두 가지 책임을 가지면 이름이 어색해집니다. 이때는 이름을 고치기 전에 분리부터 고려합니다.

---

## 검증 / 규칙

```bash
pnpm dev:client
pnpm storybook
pnpm --filter @veyor/client typecheck
pnpm check
pnpm build:client
```

- Next.js 작업 전에는 루트 `AGENTS.md`의 지침에 따라 현재 버전 문서를 확인합니다.
- `@/*` alias는 `apps/client/src/*`를 가리킵니다.
- `@veyor/shared`는 `next.config.ts`의 `transpilePackages`에 포함되어 있으므로 공유 타입·상수 import에 사용합니다.
- Tailwind CSS 4 token은 `src/app/globals.css`의 `@theme` / `@utility`를 우선합니다.
- 서버 비밀값·Supabase secret key는 클라이언트 코드에 노출하지 않습니다.
