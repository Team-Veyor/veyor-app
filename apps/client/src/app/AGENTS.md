# app/ — Next.js App Router

라우팅, 전역 레이아웃, 메타데이터, PWA 설정, 전역 스타일이 모이는 곳입니다.

---

## 무엇이 들어가는가

- App Router의 route segment, page, layout
- `metadata`, `viewport`, `manifest` 같은 앱 전역 메타 정보
- `globals.css`의 Tailwind CSS 4 theme token, base style, typography utility

→ 화면 조합과 앱 전역 설정. 재사용 UI는 `components/`로 분리합니다.

---

## 현재 구성

| 파일 | 역할 |
| --- | --- |
| `layout.tsx` | 루트 레이아웃, SUIT 로컬 폰트, `metadata`, `viewport`, `<html lang='ko'>` |
| `page.tsx` | 홈 화면 또는 화면 조합 진입점 |
| `manifest.ts` | PWA manifest 설정 |
| `globals.css` | Tailwind CSS 4 `@theme` 색상 token, 폰트 token, base reset, typography utility |

---

## 규칙

- Next.js API나 파일 규칙을 바꿀 때는 루트 `AGENTS.md` 지침에 따라 현재 버전 문서를 확인합니다.
- 페이지는 조합 책임만 가집니다. 버튼·입력·모달 같은 재사용 UI는 `components/`에 둡니다.
- 상호작용, state/effect, browser API가 필요한 파일에만 `'use client'`를 선언합니다.
- 전역 색상·타이포그래피는 `globals.css`의 token/utility로 추가하고, 컴포넌트에서는 해당 class를 사용합니다.
- PWA 아이콘·폰트처럼 정적 파일은 `public/`에 두고, 코드에서 import하는 SVG 컴포넌트는 `assets/`에 둡니다.
