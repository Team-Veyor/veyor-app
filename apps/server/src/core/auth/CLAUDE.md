# core/auth/ — 인증 (Supabase Auth + 카카오)

로그인 자체는 **Supabase Auth가 카카오 OAuth로 처리**합니다.
NestJS의 책임은 **Supabase가 발급한 JWT를 검증**하고, 요청에 사용자 정보를 실어주는 것뿐입니다.

## 인증 흐름
```
클라이언트 ──카카오 OAuth(Supabase Auth)──▶ Supabase ──JWT 발급──▶ 클라이언트
클라이언트 ──Authorization: Bearer <JWT>──▶ NestJS Guard 검증 ──▶ Controller
```
- NestJS에는 **로그인/회원가입 로직이 없다.** 토큰 검증·인가만 담당.

## 권장 구성
```
auth/
├── auth.module.ts
├── supabase-jwt.guard.ts       # Bearer 토큰 검증 (SUPABASE_JWT_SECRET)
├── current-user.decorator.ts   # @CurrentUser() → request.user
└── types.ts                    # AuthUser 등 (sub, email, role …)
```

- Guard: 헤더에서 Bearer 토큰 추출 → 검증 → 페이로드를 `request.user`에 주입. 실패 시 401.
  - 검증은 `SupabaseService.getUser(token)`(supabase-js `auth.getUser`)로 Supabase Auth 서버에 위임한다.
- 보호가 필요한 라우트에 Guard 적용. 전역 적용 + `@Public()` 예외 데코레이터 패턴도 가능.
- `@CurrentUser()`로 핸들러에서 사용자 정보를 간결히 받는다.

## 인가(권한)
- 역할 기반이 필요하면 `roles.guard.ts` + `@Roles()` 추가. 역할 소스는 JWT 클레임 또는 DB.

## 규칙
- 카카오 OAuth provider 설정·redirect URL은 **Supabase 대시보드**에서 관리(코드 아님).
- Supabase 키는 `core/config` 경유로만 접근. 토큰을 로그에 남기지 않는다.
- 참고: https://supabase.com/docs/guides/auth/social-login/auth-kakao
