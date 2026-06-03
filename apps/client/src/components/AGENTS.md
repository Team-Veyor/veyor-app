# components/ — 재사용 UI 컴포넌트

화면과 도메인에 종속되지 않는 공통 UI가 사는 곳입니다. **컴포넌트 1개 = 폴더 1개**, 구현 파일과 Storybook 파일을 함께 둡니다.

---

## 컴포넌트 폴더 표준 레이아웃

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

---

## 현재 컴포넌트

| 폴더 | 역할 |
| --- | --- |
| `Button/` | `theme`, `size`, disabled 상태를 가진 공통 버튼 |
| `Input/` | wrapper 스타일을 포함한 공통 텍스트 입력 |
| `Modal/` | `<dialog>` 기반 모달과 확인/경고 파생 모달 |
| `BottomSheet/` | `<dialog>` 기반 바텀시트와 약관 동의 바텀시트 |
| `Radio/` | 라디오 버튼과 라디오 그룹 |

---

## 책임 분리

- **Component**: props → UI 렌더링. 외부 상태 저장소나 API 호출을 직접 품지 않습니다.
- **Variant / Size**: 문자열 union 타입과 class map으로 관리합니다.
- **Storybook**: 기본, 변형, disabled/checked/open 등 주요 상태를 보여줍니다.
- **Utility**: class 합성은 `@/lib/utils`의 `cn()`을 사용합니다.

---

## 새 컴포넌트 추가 절차

1. `components/<ComponentName>/` 생성, `<ComponentName>.tsx` 작성.
2. 표준 DOM 속성을 받을 수 있으면 `ButtonHTMLAttributes`, `InputHTMLAttributes`처럼 React 타입을 확장합니다.
3. 스타일 변형은 `const VARIANT_CLASSES` / `SIZE_CLASSES`처럼 명시적 map으로 둡니다.
4. Tailwind class는 `cn(base, variant, size, className)` 순서로 합성합니다.
5. 접근성 속성(`type`, `aria-*`, `role`, focus-visible 등)을 컴포넌트 책임에 맞게 포함합니다.
6. `<ComponentName>.stories.tsx`에 사용 예시와 주요 상태를 추가합니다.
7. `pnpm --filter @veyor/client typecheck` & `pnpm check`로 검증합니다.

---

## 네이밍 규칙 (컴포넌트 한정)

공통 네이밍·가독성 규칙은 `apps/client/AGENTS.md`의 "네이밍 / 가독성 규칙" 섹션을 따릅니다. 컴포넌트 폴더에서는 다음을 추가로 지킵니다.

- 폴더와 메인 파일은 같은 `PascalCase` 이름을 사용합니다 (`Button/Button.tsx`).
- 파생 컴포넌트는 메인 컴포넌트 이름을 접미사로 유지합니다 (`Modal` → `ConfirmModal`, `WarningModal`).
- props 타입은 `<ComponentName>Props`로 명명하고 컴포넌트 파일 안에 둡니다.
- 변형/사이즈 class map은 `THEME_CLASSES`, `SIZE_CLASSES`처럼 의미 기반의 `UPPER_SNAKE_CASE`로 둡니다.
- Storybook 스토리 이름은 변형/상태가 드러나도록 짓습니다 (`Dark`, `Brand`, `Large`, `Disabled`).

---

## 컴포넌트 설계 규칙

- `className`은 최종 override 지점으로 허용합니다. wrapper가 따로 있으면 `wrapperClassName`처럼 목적을 드러냅니다.
- state/effect, `<dialog>`, `window`, `requestAnimationFrame` 등 클라이언트 런타임이 필요할 때만 `'use client'`를 선언합니다.
- 색상은 `text-gray-*`, `bg-brand`처럼 `globals.css`의 token을 우선 사용합니다. 임시 hex는 필요한 경우에만 제한적으로 사용합니다.
- 크기·간격은 기존 컴포넌트의 rounded/padding 패턴을 먼저 맞춥니다.
- 아이콘은 `assets/icons`의 컴포넌트를 import 하고, 색상은 `className`의 `text-*`로 제어합니다.
- 컴포넌트 안에 도메인 API 호출이나 서버 상태 처리를 넣지 않습니다. 화면에서 주입받은 props/callback으로 동작하게 합니다.
