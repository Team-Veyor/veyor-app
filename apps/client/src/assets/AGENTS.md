# assets/ — 코드형 에셋

컴포넌트 코드에서 import 해서 쓰는 SVG 아이콘 등 코드형 에셋이 모이는 곳입니다.
정적 파일 자체는 `public/`에 두고, React 컴포넌트로 제어할 에셋만 여기에 둡니다.

---

## 폴더 구조

```
assets/
└── icons/
    ├── CheckIcon.tsx
    ├── CheckCircleIcon.tsx
    └── ChevronDownIcon.tsx
```

---

## 책임 분리

- **assets/icons**: SVG를 React 컴포넌트로 제공하고, 크기·색상은 props/className으로 제어합니다.
- **public**: 폰트, PWA 아이콘, 이미지처럼 URL 또는 정적 파일로 제공할 리소스를 둡니다.
- **components**: 아이콘을 조합해 실제 UI 의미와 상호작용을 만듭니다.

---

## 아이콘 추가 절차

1. `src/assets/icons/<Name>Icon.tsx` 파일을 생성합니다.
2. SVG는 가능하면 `currentColor`를 사용해 부모의 `text-*` class로 색상을 제어합니다.
3. `className`을 받아 컴포넌트 사용처에서 크기·색상을 조정할 수 있게 합니다.
4. 특정 컴포넌트 전용 아이콘이 아니라 여러 UI에서 재사용 가능한 경우에만 여기에 둡니다.
5. 사용처 Storybook에서 아이콘 상태가 잘 보이는지 확인합니다.

---

## 규칙

- 서버/원격 API와 관련된 자산 처리 로직을 두지 않습니다.
- 한 화면에서만 쓰는 장식성 SVG는 해당 컴포넌트 근처에 두는 것을 우선합니다.
- 색상 token은 `globals.css`의 Tailwind token을 우선합니다.
