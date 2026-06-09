# Design Tokens

Figma의 디자인 토큰을 코드의 Tailwind v4 `@theme`까지 자동으로 연결하는 파이프라인 문서입니다.

## 전체 흐름

```
Figma (디자이너의 네이티브 Variables)
   ↓ Tokens Studio 플러그인의 "Bring styles and variables into Tokens Studio"
Tokens Studio 플러그인
   ↕ GitHub Sync (push/pull)
tokens/*.json            ← Source of Truth
   ↓ pnpm tokens:build (Style Dictionary v5)
apps/client/src/styles/tokens.generated.css   ← Tailwind v4 @theme 블록
   ↓ globals.css에서 @import
Tailwind 자동 인식 → 유틸리티 클래스 생성
```

## 디렉토리 구조

```
tokens/
├── global.json      # Tokens Studio가 관리하는 원시(core) 토큰
└── semantic.json    # success/warning/danger/surface 같은 의미 토큰 (alias)
style-dictionary.config.mjs   # Style Dictionary 설정 + Tailwind 커스텀 포맷
apps/client/src/styles/
├── tokens.generated.css      # 자동 생성됨 (커밋함, 직접 편집 금지)
└── globals.css               # tokens.generated.css를 import
```

## 토큰 구조

### Core 토큰 (`tokens/global.json`)

Figma Variables에서 가져온 원시 값. 색상 스케일, 폰트, 간격 등.

```json
{
  "Colors": {
    "Brand": {
      "Scale": { "500": { "$type": "color", "$value": "#09ba8e" } },
      "Alpha": { "10":  { "$type": "color", "$value": "#09ba8e1a" } }
    }
  }
}
```

→ 빌드 결과: `--color-brand-500`, `--color-brand-alpha-10`

### Semantic 토큰 (`tokens/semantic.json`)

UI 의미에 따라 core 토큰을 alias.

```json
{
  "color": {
    "success": { "$type": "color", "$value": "{Colors.Blue.Scale.700}" },
    "surface": {
      "success": { "$type": "color", "$value": "{Colors.Blue.Alpha.10}" }
    }
  }
}
```

→ 빌드 결과: `--color-success`, `--color-surface-success`

→ Tailwind 클래스: `text-success`, `bg-surface-success`

## 사용 방법

### 컴포넌트에서

```tsx
// ❌ Core 토큰 직접 사용 (피하기)
<div className="bg-blue-alpha-10 text-blue-700">...</div>

// ✅ Semantic 토큰 사용
<div className="bg-surface-success text-success">...</div>
```

원칙: **`brand`, `success`, `warning`, `danger`** 같은 상태/의미는 semantic 토큰을 쓰고, gray scale이나 brand scale 같은 원시 색상은 core 토큰을 직접 써도 됩니다.

### 토큰 추가/수정

#### A. 디자이너가 Figma에서 변경한 경우

1. 디자이너가 Figma Variables 수정
2. Tokens Studio 플러그인 열기 → 하단 **`Styles & Variables ▼`** → **`Bring styles and variables into Tokens Studio`**
3. **GitHub Sync 설정이 되어 있으면** 자동으로 PR 생성 (아래 참고)
4. 로컬에서 PR pull → `pnpm tokens:build` → 커밋

#### B. 코드에서 semantic 토큰만 추가

1. `tokens/semantic.json` 편집
2. `pnpm tokens:build`
3. 커밋

## Tokens Studio ↔ GitHub Sync 설정

디자이너가 Figma에서 토큰을 변경하면 자동으로 PR이 생기는 흐름을 만듭니다.

### 1. GitHub Personal Access Token 발급

1. GitHub Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. **Repository access**: `veyor-app` 만 선택
3. **Permissions**:
   - Contents: **Read and write**
   - Pull requests: **Read and write**
4. 토큰 생성 → 디자이너에게 안전하게 전달 (또는 본인이 보관)

### 2. Tokens Studio에서 sync provider 추가

1. Figma → Tokens Studio 플러그인 → 상단 **Settings** 탭
2. **Sync providers** 섹션 → **Add new sync provider**
3. **GitHub** 선택 후 입력:
   - **Name**: `Veyor`
   - **Personal Access Token**: 위에서 발급한 토큰
   - **Repository**: `<owner>/veyor-app`
   - **Branch**: `main` (또는 작업 브랜치)
   - **File path**: `tokens/global.json`
   - **baseUrl**: 비워둠 (github.com 기본값)
4. **Save**

### 3. 사용

- 토큰 수정 후 플러그인 우측 상단의 **Push to GitHub** 버튼 → 새 PR 생성됨
- 로컬에서 PR pull → `pnpm tokens:build` 자동 실행됨 (predev/prebuild 훅) → 커밋

### 주의

- **`semantic.json`은 Tokens Studio가 건드리지 않음** — 코드에서만 관리하면 됩니다.
- 무료 플랜은 sync provider 1개로 제한.

## 자동 실행되는 시점

`pnpm tokens:build`는 다음 시점에 자동 실행됩니다 (`apps/client/package.json` 훅):

| 명령 | 자동 실행 |
| --- | --- |
| `pnpm dev:client` | ✅ predev |
| `pnpm build:client` | ✅ prebuild |
| `pnpm storybook` | ✅ prestorybook |
| `pnpm storybook:build` | ✅ prestorybook:build |

수동 실행:
```bash
pnpm tokens:build      # 1회 빌드
pnpm tokens:watch      # 파일 변경 감지 빌드
```

## CLI 자동화 (옵션, 미적용)

Tokens Studio 플러그인을 거치지 않고 Figma Variables를 직접 가져오려면 **Figma Variables REST API**를 써야 합니다. **Figma Enterprise 플랜에서만 동작**하므로 현재는 적용하지 않습니다.
