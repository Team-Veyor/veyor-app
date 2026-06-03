# common/ — 공통 유틸 (도메인 무관)

여러 모듈이 공유하는 **상태 없는 재사용 빌딩블록**. NestJS에는 의존하지만 특정 도메인은 모릅니다.

## 하위 폴더

| 폴더 | 용도 | 예시 |
| --- | --- | --- |
| `filters/` | 예외 → 일관된 에러 응답 변환 | `all-exceptions.filter.ts`, supabase 에러 매핑 |
| `guards/` | 도메인 무관 범용 가드 | rate-limit, api-key 등 (인증 가드는 `core/auth`) |
| `interceptors/` | 횡단 관심사 | logging, 응답 transform, timeout |
| `pipes/` | 입력 검증·변환 | global ValidationPipe 설정 |
| `decorators/` | 범용 데코레이터 | `@ApiPaginated`, 파라미터 데코레이터 등 |

추가로 두기 좋은 것: `dto/`(페이지네이션 등 공통 DTO), `constants/`, `utils/`(순수 함수), `types/`.

## core 와의 차이

| | `core/` | `common/` |
| --- | --- | --- |
| 성격 | 상태 있는 인프라(연결·설정) | 상태 없는 유틸 |
| 등록 | 보통 `@Global()` 모듈 1회 | 필요한 곳에서 import / 전역 등록 |
| 예 | Supabase 클라이언트, 인증 | 예외 필터, 로깅 인터셉터 |

## 규칙
- **도메인 지식 금지.** 특정 도메인이 보이면 그건 `modules/`로 가야 한다.
- 여기 코드는 어떤 모듈이든 자유롭게 import 할 수 있어야 한다(순환 의존 주의).
- 전역으로 적용할 filter/pipe/interceptor는 `main.ts` 또는 `app.module.ts`의 `APP_*` provider로 등록.
