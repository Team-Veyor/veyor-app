# Supabase 클라이언트 연동 가이드 (프론트엔드)

> `apps/client`(Next.js, Vercel 배포)에서 **Supabase Auth(카카오 로그인)** 를 처리하고,
> 발급된 JWT로 백엔드 API(`https://api.bsg.io.kr`)를 호출하는 방법.
>
> **역할 분담**: 로그인/세션은 **Supabase Auth(클라이언트)** 가 담당하고, 백엔드(NestJS)는 그 JWT를 **검증만** 합니다.
> 따라서 로그인 API는 서버에 없고, 클라이언트가 직접 Supabase로 로그인합니다.

---

## 1. 설치

```bash
pnpm --filter @veyor/client add @supabase/supabase-js
```

## 2. 환경변수 (`.env.local` / Vercel)

| 키 | 값 | 비고 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vqhpfoyylmtzeeewkkgz.supabase.co` | 공개 가능 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` (publishable key) | 공개 가능. **secret key 절대 금지** |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.bsg.io.kr` | 백엔드 API 주소 |

> ⚠️ 클라이언트엔 **publishable(anon) key만**. `SUPABASE_SECRET_KEY`(sb_secret_)는 서버 전용이며 절대 프론트에 넣지 않습니다.

## 3. Supabase 클라이언트 (`lib/supabase.ts`)

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,      // 세션 로컬 저장 (자동 로그인)
      autoRefreshToken: true,    // 만료 전 토큰 자동 갱신
      detectSessionInUrl: true,  // OAuth 콜백 처리
    },
  },
);
```

## 4. 카카오 로그인

```ts
export async function loginWithKakao() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      // 콜백 후 돌아올 주소 (Supabase Redirect URLs에 등록돼 있어야 함)
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  // → 카카오 동의 화면으로 리다이렉트됨
}
```

- 카카오 동의 → `https://vqhpfoyylmtzeeewkkgz.supabase.co/auth/v1/callback` → 앱의 `redirectTo`로 복귀
- `detectSessionInUrl: true`면 콜백 URL의 토큰을 자동 파싱해 세션 저장

> Supabase 대시보드 → Authentication → URL Configuration의 **Redirect URLs**에 `https://www.bsg.io.kr/auth/callback`(배포), `http://localhost:3000/auth/callback`(개발) 등록 필요.

## 5. 로그인 후 분기 (신규/기존)

세션이 잡히면 백엔드 `GET /users/me`로 온보딩 여부 확인:

```ts
const me = await apiFetch('/users/me');        // 아래 6번 헬퍼
if (!me.onboarded) router.replace('/onboarding'); // 신규 → 온보딩
else router.replace('/home');                      // 기존 → 홈
```

## 6. API 호출 헬퍼 (JWT 자동 첨부)

```ts
import { supabase } from './supabase';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401) {
    // 세션 만료/무효 → 로그인으로
    await supabase.auth.signOut();
    window.location.href = '/login';
    return;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}
```

핵심: 모든 보호 API는 `Authorization: Bearer <access_token>` 필요. 토큰은 `supabase.auth.getSession()`에서 꺼냅니다.

## 7. 주요 호출 예시 (api-spec 기준)

```ts
// 온보딩 (정보입력 + 약관동의)
await apiFetch('/users/onboarding', {
  method: 'POST',
  body: JSON.stringify({
    birthYear: 1998,
    gender: 'female',
    consents: { privacy: true, terms: true, marketing: false },
  }),
});

// 홈 집계
const home = await apiFetch('/home');

// 오늘 설문 → 외부 링크 이동
const survey = await apiFetch('/surveys/today');
// 설문 복귀 후 완료 인증
await apiFetch(`/surveys/${survey.id}/complete`, { method: 'POST' });

// 계좌 등록
await apiFetch('/accounts', {
  method: 'POST',
  body: JSON.stringify({ bank: 'KB국민은행', accountNo: '33330000001234', holderName: '김가온' }),
});

// 참여 내역
await apiFetch('/participations?from=2025-10-01&to=2025-10-31');
```

## 8. 로그아웃 / 탈퇴

```ts
// 로그아웃 (클라이언트 세션 종료)
await supabase.auth.signOut();
router.replace('/login');

// 회원 탈퇴 (서버에서 계정·데이터 cascade 삭제)
await apiFetch('/users/me', { method: 'DELETE' });
await supabase.auth.signOut();
router.replace('/login');
```

## 9. 세션 상태 구독 (자동 로그인 UX)

```ts
supabase.auth.onAuthStateChange((event, session) => {
  // 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' ...
  // 전역 상태(로그인 여부)에 반영
});
```

---

## 체크리스트 (배포 전)

- [ ] Vercel 환경변수 3개 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL`)
- [ ] Supabase Redirect URLs에 배포/개발 콜백 주소 등록
- [ ] 백엔드 `CLIENT_ORIGIN`에 프론트 주소(`https://www.bsg.io.kr`) 설정 (CORS) — *설정 완료*
- [ ] secret key가 프론트 코드/환경변수에 절대 없는지 확인

## 참고
- API 상세: [`api-spec.md`](./api-spec.md)
- 인증 흐름(서버측): `apps/server/src/core/auth/CLAUDE.md`
- 카카오/Supabase 설정: Supabase 대시보드 Authentication → Providers → Kakao
