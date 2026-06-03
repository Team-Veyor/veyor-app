# core/ — 앱 전역 인프라

도메인이 아니라 **앱을 떠받치는 기반 설비**가 모이는 곳입니다. 대부분 싱글톤이며 루트에서 한 번만 등록됩니다.

## 무엇이 들어가는가
- 비즈니스 도메인 지식이 없고
- 앱 수명 동안 살아있으며
- 여러 모듈이 공유하는 인프라

→ DB 연결, 인증, 설정 로딩 등.

## 하위 폴더

| 폴더 | 역할 | 문서 |
| --- | --- | --- |
| `config/` | 환경변수 로딩·검증, 타입 안전한 설정 제공 | `config/CLAUDE.md` |
| `supabase/` | `@supabase/supabase-js` 클라이언트 래퍼 (DB 접근 진입점) | `supabase/CLAUDE.md` |
| `auth/` | Supabase 발급 JWT 검증 Guard, 카카오 로그인 연동, `@CurrentUser` | `auth/CLAUDE.md` |

## 규칙
- 여기 모듈은 보통 `@Global()`로 만들거나 `app.module.ts`에서 1회 import 하여 어디서나 주입 가능하게 한다.
- **도메인 로직을 두지 않는다.** 사용자가 받는 기능은 `modules/`로.
- `core`는 `modules`를 import 하지 않는다(의존 방향: modules → core, 역방향 금지).
