# stories/ — Storybook 문서

Storybook 문서(MDX)나 전역 예시를 둘 수 있는 곳입니다.
컴포넌트별 stories는 기본적으로 각 컴포넌트 폴더에 함께 둡니다.

---

## Storybook 위치 규칙

| 대상 | 위치 |
| --- | --- |
| 컴포넌트별 상태·변형 story | `src/components/<ComponentName>/<ComponentName>.stories.tsx` |
| 전역 디자인 가이드·문서형 MDX | `src/stories/*.mdx` |
| Storybook 설정 | `apps/client/.storybook/` |

---

## 작성 규칙

- 새 공통 컴포넌트를 추가하면 주요 상태를 `.stories.tsx`로 함께 작성합니다.
- 기본, disabled/open/checked 등 상호작용 상태, 주요 variant/size를 보여줍니다.
- story는 컴포넌트 사용 예시이므로 실제 사용자가 넘길 props 형태를 우선합니다.
- 전역 문서가 필요할 때만 `src/stories`에 MDX를 추가합니다.

---

## 검증

```bash
pnpm storybook
pnpm storybook:build
```
