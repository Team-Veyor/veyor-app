# core/config/ — 환경설정

환경변수를 **한 곳에서 로딩·검증**하고, 타입 안전하게 앱 전역에 제공합니다.
코드 어디서도 `process.env`를 직접 읽지 않는 것이 목표입니다(오타·누락·undefined 방지).

## 권장 구성
- `@nestjs/config`의 `ConfigModule`을 `isGlobal: true`로 등록.
- 앱 시작 시 스키마로 환경변수 **검증**(누락 시 부팅 실패가 안전). 검증 라이브러리(예: zod / joi)로 `validate` 또는 `validationSchema` 지정.
- 도메인별로 묶고 싶으면 `registerAs`로 네임스페이스 설정 객체를 만든다.

```
config/
├── config.module.ts        # ConfigModule.forRoot({ isGlobal, validate })
├── env.validation.ts       # 환경변수 스키마·검증
└── configuration.ts        # registerAs(...) 그룹 (선택)
```

## 다루는 주요 환경변수 (예시)
| 키 | 용도 | 비고 |
| --- | --- | --- |
| `PORT` | 서버 포트 | 기본 4000 (`main.ts`) |
| `SUPABASE_URL` | Supabase 프로젝트 URL | 필수 |
| `SUPABASE_SECRET_KEY` | 서버 전용 secret key (`sb_secret_...`) | ⚠️ 절대 클라이언트 노출·커밋 금지 |
| `SUPABASE_PUBLISHABLE_KEY` | publishable key (`sb_publishable_...`) | 선택 (RLS 컨텍스트 클라이언트용) |
| `CLIENT_ORIGIN` | CORS 허용 출처 | 기본 `http://localhost:3000` |

> Supabase **신규 API 키 포맷** 사용: `sb_secret_*`(서버 전용, 옛 service_role 대체) / `sb_publishable_*`(클라이언트, 옛 anon 대체).

## 규칙
- 비밀값은 `.env`(gitignore)로만. 저장소에는 `.env.example`로 **키 이름만** 남긴다.
- 새 환경변수를 추가하면 반드시 검증 스키마와 `.env.example`을 함께 갱신한다.
