# supabase/ — DB 스키마 & 마이그레이션 (Supabase CLI)

DB 스키마는 **코드가 아니라 마이그레이션으로** 관리합니다. Supabase CLI가 이 폴더를 사용합니다.

## 구성 (CLI가 생성)
```
supabase/
├── config.toml         # 로컬 Supabase 스택 설정
├── migrations/         # 타임스탬프 SQL 마이그레이션 (순서 보장)
│   └── <timestamp>_<name>.sql
└── seed.sql            # 시드 데이터 (선택)
```

## 기본 워크플로
```bash
supabase init                              # 최초 1회 (이 폴더 생성)
supabase start                             # 로컬 Postgres/Auth 스택 기동
supabase migration new <name>              # 새 마이그레이션 파일 생성
supabase db reset                          # 로컬 DB를 마이그레이션으로 재구축
supabase db push                           # 원격(클라우드) 프로젝트에 적용
supabase gen types typescript --local      # 스키마 → TS 타입 생성
```

## 규칙
- 스키마 변경은 반드시 **새 마이그레이션 파일**로. 기존 마이그레이션은 수정하지 않는다(이미 적용된 이력).
- **RLS(Row Level Security)** 정책도 마이그레이션에 포함해 코드화한다. 기본 활성 전제.
- 생성한 TS 타입은 서버(그리고 필요 시 `packages/shared`)에서 재사용해 DB-코드 타입 일치를 유지.
- 카카오 등 Auth provider 설정은 마이그레이션이 아니라 Supabase **대시보드/`config.toml`**에서.
- 참고: https://supabase.com/docs/guides/cli / https://supabase.com/docs/guides/deployment/database-migrations
