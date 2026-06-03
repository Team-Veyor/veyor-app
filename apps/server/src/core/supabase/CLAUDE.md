# core/supabase/ — Supabase 클라이언트

DB 접근의 **유일한 진입점**. `@supabase/supabase-js` 클라이언트를 생성·주입합니다.
ORM은 쓰지 않습니다. 도메인의 Repository가 여기서 받은 클라이언트로 쿼리합니다.

## 권장 구성
```
supabase/
├── supabase.module.ts      # @Global() 모듈, 클라이언트 provider 등록
└── supabase.service.ts     # createClient(...) 래퍼, 헬퍼 노출
```

- `SUPABASE_URL` + 키로 `createClient` 생성 (값은 `core/config`에서 주입). Supabase **신규 API 키 포맷** 사용.
- `SupabaseService`가 제공하는 것:
  - **`admin`**: secret key(`sb_secret_*`) 기반. RLS 우회 관리 작업 전용. ⚠️ 꼭 필요한 곳에서만, 신중히.
  - **`getUser(jwt)`**: 사용자 access token 검증.
  - **`forUser(jwt)`**: 사용자 컨텍스트(RLS 적용) 클라이언트. publishable key(`sb_publishable_*`)가 설정된 경우에만.
- `@Global()`로 등록해 어느 모듈에서나 주입받게 한다.

## 사용 패턴
- Service는 supabase-js를 **직접 호출하지 않는다.** 각 도메인의 Repository가 이 서비스를 주입받아 쿼리를 캡슐화한다.
- 에러는 supabase 응답의 `{ data, error }`를 확인해 Nest 예외로 변환(전역 filter는 `common/filters` 참고).

## 규칙
- 테이블 스키마 변경은 코드가 아니라 **마이그레이션**으로 (→ `apps/server/supabase/CLAUDE.md`).
- RLS를 기본 활성화 전제로 설계. `admin`(secret key) 사용은 최소화하고 이유를 주석으로 남긴다.
