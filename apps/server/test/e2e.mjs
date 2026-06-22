// Veyor API e2e 시나리오 테스트 (실제 HTTP, 실제 Supabase)
// 실행: node apps/server/test/e2e.mjs
// - service key로 테스트 유저/세션 발급 → 모든 엔드포인트 호출 → 검증 → 정리(테스트 데이터 삭제)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL ?? 'http://localhost:4000';

// --- .env 로드 ---
function loadEnv() {
  const text = readFileSync(join(__dirname, '..', '.env'), 'utf8');
  const env = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}
const env = loadEnv();
const SUPABASE_URL = env.SUPABASE_URL;
const SECRET = env.SUPABASE_SECRET_KEY;
const admin = createClient(SUPABASE_URL, SECRET, { auth: { persistSession: false } });

// --- 테스트 러너 ---
let pass = 0;
let fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) {
    pass += 1;
    console.log(`  ✓ ${name}`);
  } else {
    fail += 1;
    failures.push(`${name} — ${detail ?? ''}`);
    console.log(`  ✗ ${name} ${detail ? `→ ${detail}` : ''}`);
  }
}

async function api(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  const text = await res.text();
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }
  return { status: res.status, body: json };
}

const seededSurveyIds = [];
let testUserId = null;
const NONEXISTENT_UUID = '00000000-0000-0000-0000-000000000000';

async function main() {
  console.log(`\n=== Veyor API e2e (${BASE}) ===\n`);

  // ---------- 0. Public ----------
  console.log('[0] Public 엔드포인트');
  let r = await api('GET', '/health');
  check('GET /health 200 ok', r.status === 200 && r.body?.status === 'ok', JSON.stringify(r));
  r = await api('GET', '/terms/terms');
  check('GET /terms/terms 200', r.status === 200 && !!r.body?.title, JSON.stringify(r));
  r = await api('GET', '/terms/nope');
  check('GET /terms/nope 404', r.status === 404, JSON.stringify(r));

  // ---------- 인증 가드 ----------
  console.log('[auth] 미인증 차단');
  r = await api('GET', '/users/me');
  check('GET /users/me 미인증 401', r.status === 401, JSON.stringify(r));
  r = await api('GET', '/home', { token: 'invalid.token' });
  check('GET /home 잘못된 토큰 401', r.status === 401, JSON.stringify(r));

  // ---------- 테스트 유저/세션 ----------
  console.log('[setup] 테스트 유저 + 세션 발급');
  const email = `e2e_${Date.now()}@veyor-test.dev`;
  const password = 'Test1234!veyor';
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: 'E2E 테스터' },
  });
  if (created.error) {
    throw new Error(`테스트 유저 생성 실패: ${created.error.message}`);
  }
  testUserId = created.data.user.id;
  // 로그인은 별도 클라이언트로 — admin 클라이언트에 사용자 세션이 실리면
  // 이후 admin DB 작업이 사용자(RLS) 컨텍스트로 실행되어 시드가 막힌다.
  const signInClient = createClient(SUPABASE_URL, SECRET, { auth: { persistSession: false } });
  const signIn = await signInClient.auth.signInWithPassword({ email, password });
  if (signIn.error || !signIn.data.session) {
    throw new Error(`로그인(세션 발급) 실패: ${signIn.error?.message ?? 'no session'}`);
  }
  const token = signIn.data.session.access_token;
  check('세션 access_token 발급', !!token);

  // 트리거가 profiles 자동 생성했는지
  const { data: profileRow } = await admin
    .from('profiles')
    .select('id')
    .eq('id', testUserId)
    .maybeSingle();
  check('가입 시 profiles 자동 생성(trigger)', !!profileRow, '트리거 미동작');

  // ---------- 설문 시드 ----------
  console.log('[setup] 설문 시드');
  const now = Date.now();
  const seed = await admin
    .from('surveys')
    .insert([
      {
        title: '오늘의 설문 (e2e)',
        external_url: 'https://example.com/survey/today',
        reward_amount: 300,
        est_minutes: '2-3',
        opens_at: new Date(now - 3600_000).toISOString(),
        expires_at: new Date(now + 86400_000).toISOString(),
        is_published: true,
        approval_status: 'approved',
      },
      {
        title: '남성 타깃 설문 (e2e)',
        external_url: 'https://example.com/survey/male',
        reward_amount: 500,
        target_gender: 'male',
        opens_at: new Date(now - 60_000).toISOString(), // 더 최신이지만 타깃 불일치로 제외돼야 함
        expires_at: new Date(now + 86400_000).toISOString(),
        is_published: true,
        approval_status: 'approved',
      },
      {
        title: '만료 설문 (e2e)',
        external_url: 'https://example.com/survey/expired',
        reward_amount: 100,
        opens_at: new Date(now - 7200_000).toISOString(),
        expires_at: new Date(now - 3600_000).toISOString(),
        is_published: true,
        approval_status: 'approved',
      },
      {
        title: '미게시 설문 (e2e)',
        external_url: 'https://example.com/survey/draft',
        reward_amount: 999,
        opens_at: new Date(now - 30_000).toISOString(), // 가장 최신이지만 미게시라 노출 제외
        expires_at: new Date(now + 86400_000).toISOString(),
        is_published: false,
        approval_status: 'pending',
      },
    ])
    .select('id, title, expires_at, target_gender');
  if (seed.error) throw new Error(`설문 시드 실패: ${seed.error.message}`);
  for (const s of seed.data) seededSurveyIds.push(s.id);
  const todaySurveyId = seed.data.find((s) => s.title.includes('오늘')).id;
  const maleSurveyId = seed.data.find((s) => s.title.includes('남성')).id;
  const expiredSurveyId = seed.data.find((s) => s.title.includes('만료')).id;
  const draftSurveyId = seed.data.find((s) => s.title.includes('미게시')).id;

  // ---------- 1. 온보딩 ----------
  console.log('[1] 온보딩/사용자');
  r = await api('GET', '/users/me', { token });
  check(
    'GET /users/me 200 (온보딩 전)',
    r.status === 200 && r.body?.onboarded === false,
    JSON.stringify(r),
  );
  check(
    '초기 누적 0',
    r.body?.totalRewardCount === 0 && r.body?.totalRewardAmount === 0,
    JSON.stringify(r.body),
  );

  r = await api('GET', '/consents', { token });
  check('GET /consents 3개 항목', Array.isArray(r.body) && r.body.length === 3, JSON.stringify(r));

  r = await api('POST', '/users/onboarding', {
    token,
    body: { birthYear: 1998, gender: 'female', consents: { privacy: false, terms: true } },
  });
  check('온보딩 필수약관 미동의 400', r.status === 400, JSON.stringify(r));

  r = await api('POST', '/users/onboarding', {
    token,
    body: {
      birthYear: 1998,
      gender: 'female',
      consents: { privacy: true, terms: true, marketing: false },
    },
  });
  check('온보딩 성공 201', r.status === 201 && r.body?.onboarded === true, JSON.stringify(r));

  r = await api('POST', '/users/onboarding', {
    token,
    body: { birthYear: 1998, gender: 'female', consents: { privacy: true, terms: true } },
  });
  check('온보딩 재시도 409', r.status === 409, JSON.stringify(r));

  r = await api('GET', '/users/me', { token });
  check(
    '온보딩 후 프로필 반영',
    r.body?.onboarded === true && r.body?.birthYear === 1998 && r.body?.gender === 'female',
    JSON.stringify(r.body),
  );

  // ---------- 2. 동의 ----------
  console.log('[2] 동의');
  r = await api('PATCH', '/consents', { token, body: { marketing: true } });
  const marketing = Array.isArray(r.body) ? r.body.find((c) => c.type === 'marketing') : null;
  check(
    'PATCH /consents 마케팅 true',
    r.status === 200 && marketing?.agreed === true,
    JSON.stringify(r),
  );
  r = await api('PATCH', '/consents', { token, body: { privacy: false } });
  check('PATCH /consents 필수약관 철회 400', r.status === 400, JSON.stringify(r));

  // ---------- 3. 홈 (계좌 미등록) ----------
  console.log('[3] 홈');
  r = await api('GET', '/home', { token });
  check(
    'GET /home 계좌 미등록',
    r.status === 200 && r.body?.accountRegistered === false,
    JSON.stringify(r.body),
  );
  check(
    '홈 오늘 설문 노출(타깃 매칭)',
    r.body?.todaySurvey?.id === todaySurveyId,
    `expected ${todaySurveyId}, got ${r.body?.todaySurvey?.id}`,
  );
  check('홈 남성타깃 설문 제외', r.body?.todaySurvey?.id !== maleSurveyId);
  check(
    '홈 미참여 시 rewardStatus pending',
    r.body?.todaySurvey?.participated === false && r.body?.todaySurvey?.rewardStatus === 'pending',
    JSON.stringify(r.body?.todaySurvey),
  );

  // ---------- 4. 계좌 ----------
  console.log('[4] 계좌');
  r = await api('GET', '/accounts/banks', { token });
  check(
    'GET /accounts/banks 은행 목록',
    r.status === 200 && Array.isArray(r.body) && r.body.includes('KB국민'),
    JSON.stringify(r),
  );

  r = await api('GET', '/accounts', { token });
  check(
    'GET /accounts 초기 []',
    r.status === 200 && Array.isArray(r.body) && r.body.length === 0,
    JSON.stringify(r),
  );

  r = await api('POST', '/accounts', {
    token,
    body: { bank: 'KB국민', accountNo: '33330000001234', holderName: '김가온' },
  });
  const acc1 = r.body;
  check(
    'POST /accounts 첫 계좌 대표',
    r.status === 201 && acc1?.isPrimary === true,
    JSON.stringify(r),
  );
  check('계좌번호 마스킹', acc1?.accountNoMasked === '3333****1234', JSON.stringify(acc1));

  r = await api('POST', '/accounts', {
    token,
    body: { bank: '신한', accountNo: '110123456789', holderName: '김가온' },
  });
  const acc2 = r.body;
  check(
    'POST /accounts 두번째 비대표',
    r.status === 201 && acc2?.isPrimary === false,
    JSON.stringify(r),
  );

  r = await api('POST', '/accounts', {
    token,
    body: { bank: '', accountNo: '123', holderName: '' },
  });
  check('POST /accounts 검증 400', r.status === 400, JSON.stringify(r));

  r = await api('POST', '/accounts', {
    token,
    body: { bank: '없는은행', accountNo: '33330000009999', holderName: '김가온' },
  });
  check('POST /accounts 지원하지 않는 은행 400', r.status === 400, JSON.stringify(r));

  r = await api('POST', '/accounts', {
    token,
    body: { bank: 'KB국민', accountNo: '33330000001234', holderName: '김가온' },
  });
  check('POST /accounts 중복 계좌 409', r.status === 409, JSON.stringify(r));

  r = await api('GET', '/accounts', { token });
  check('GET /accounts 2건', r.status === 200 && r.body.length === 2, JSON.stringify(r));

  r = await api('PATCH', `/accounts/${acc2.id}/primary`, { token });
  check('PATCH 대표 변경 200', r.status === 200 && r.body?.isPrimary === true, JSON.stringify(r));
  r = await api('GET', '/accounts', { token });
  const primaryNow = r.body.find((a) => a.isPrimary);
  check(
    '대표 계좌 1개 + acc2가 대표',
    r.body.filter((a) => a.isPrimary).length === 1 && primaryNow?.id === acc2.id,
    JSON.stringify(r.body),
  );

  r = await api('PATCH', `/accounts/${acc1.id}`, { token, body: { accountNo: '33339999005678' } });
  check(
    'PATCH 계좌 수정',
    r.status === 200 && r.body?.accountNoMasked === '3333****5678',
    JSON.stringify(r),
  );

  r = await api('PATCH', `/accounts/${NONEXISTENT_UUID}`, { token, body: { bank: '신한' } });
  check('PATCH 없는 계좌 404', r.status === 404, JSON.stringify(r));

  r = await api('DELETE', `/accounts/${acc2.id}`, { token }); // 대표 삭제 → 남은 1개 자동 대표
  check(
    'DELETE 대표계좌 → 자동 재지정',
    r.status === 200 &&
      r.body?.primaryReassigned === acc1.id &&
      r.body?.needsPrimarySelection === false,
    JSON.stringify(r),
  );

  // ---------- 5. 설문 참여 (start → 외부 설문 → complete) ----------
  console.log('[5] 설문 참여/완료');
  r = await api('GET', '/surveys/today', { token });
  check(
    'GET /surveys/today (게시·승인된 설문만, 미게시 제외)',
    r.status === 200 && r.body?.id === todaySurveyId && r.body?.participated === false,
    JSON.stringify(r.body),
  );

  // 미게시 설문은 시작 불가 (노출 게이트)
  r = await api('POST', `/surveys/${draftSurveyId}/start`, { token });
  check('미게시 설문 시작 차단 404', r.status === 404, JSON.stringify(r));

  // start 기록 없이 complete 직접 호출 → 차단(일반 메시지)
  r = await api('POST', `/surveys/${maleSurveyId}/complete`, { token });
  check('start 없이 완료 차단 400', r.status === 400, JSON.stringify(r));

  r = await api('POST', `/surveys/${expiredSurveyId}/complete`, { token });
  check('만료 설문 완료 410', r.status === 410, JSON.stringify(r));

  r = await api('POST', `/surveys/${NONEXISTENT_UUID}/complete`, { token });
  check('없는 설문 완료 404', r.status === 404, JSON.stringify(r));

  r = await api('POST', '/surveys/not-a-uuid/complete', { token });
  check('잘못된 surveyId 400', r.status === 400, JSON.stringify(r));

  // 참여 시작 (외부 설문 이동 직전)
  r = await api('POST', `/surveys/${todaySurveyId}/start`, { token });
  check('설문 시작 201 + started', r.status === 201 && r.body?.status === 'started', JSON.stringify(r));

  // 시작 멱등 — 재호출해도 중복 생성 안 함
  r = await api('POST', `/surveys/${todaySurveyId}/start`, { token });
  check('설문 시작 멱등', r.status === 201 && r.body?.status === 'started', JSON.stringify(r));

  // 시작만 한 상태는 아직 완료 아님
  r = await api('GET', '/surveys/today', { token });
  check('시작 후에도 participated false', r.body?.participated === false, JSON.stringify(r.body));

  // 완료 인증 (start 기록 있어야 통과)
  r = await api('POST', `/surveys/${todaySurveyId}/complete`, { token });
  check(
    '설문 완료 201 + 리워드 pending',
    r.status === 201 && r.body?.reward?.amount === 300 && r.body?.reward?.status === 'pending',
    JSON.stringify(r),
  );

  r = await api('POST', `/surveys/${todaySurveyId}/complete`, { token });
  check('중복 참여 409', r.status === 409, JSON.stringify(r));

  r = await api('GET', '/surveys/today', { token });
  check('완료 후 participated true', r.body?.participated === true, JSON.stringify(r.body));

  // ---------- 6. 참여 내역 / 누적 ----------
  console.log('[6] 참여 내역');
  r = await api('GET', '/participations', { token });
  check(
    'GET /participations 1건',
    r.status === 200 && r.body?.totalCount === 1 && r.body?.totalAmount === 300,
    JSON.stringify(r.body),
  );
  check(
    '참여 항목 필드',
    r.body?.items?.[0]?.surveyTitle?.includes('오늘') && r.body?.items?.[0]?.rewardAmount === 300,
    JSON.stringify(r.body?.items),
  );

  r = await api('GET', '/participations?from=2020-01-01&to=2020-12-31', { token });
  check('기간 필터(과거) 0건', r.body?.totalCount === 0, JSON.stringify(r.body));
  r = await api('GET', '/participations?from=bad', { token });
  check('잘못된 from 400', r.status === 400, JSON.stringify(r));

  r = await api('GET', '/users/me', { token });
  check(
    '누적 반영',
    r.body?.totalRewardCount === 1 && r.body?.totalRewardAmount === 300,
    JSON.stringify(r.body),
  );

  r = await api('GET', '/home', { token });
  check(
    '홈 streak 1 + 계좌 등록됨',
    r.body?.streak?.count === 1 && r.body?.accountRegistered === true,
    JSON.stringify(r.body),
  );

  // ---------- 7. 탈퇴 ----------
  console.log('[7] 탈퇴');
  r = await api('DELETE', '/users/me', { token });
  check('DELETE /users/me 204', r.status === 204, JSON.stringify(r));
  // 탈퇴 후 토큰 무효(사용자 삭제)
  r = await api('GET', '/users/me', { token });
  check('탈퇴 후 401', r.status === 401, JSON.stringify(r));
  const { data: goneProfile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', testUserId)
    .maybeSingle();
  check('탈퇴 시 profiles cascade 삭제', !goneProfile);
  testUserId = null; // 이미 삭제됨

  // ---------- 정리 ----------
  console.log('\n[cleanup] 시드 데이터 삭제');
  await cleanup();

  console.log(`\n=== 결과: ${pass} passed, ${fail} failed ===`);
  if (fail > 0) {
    console.log('\n실패 목록:');
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
  process.exit(0);
}

async function cleanup() {
  try {
    if (seededSurveyIds.length) {
      await admin.from('surveys').delete().in('id', seededSurveyIds);
    }
    if (testUserId) {
      await admin.auth.admin.deleteUser(testUserId);
    }
  } catch (e) {
    console.log(`  cleanup 경고: ${e.message}`);
  }
}

main().catch(async (e) => {
  console.error(`\n치명적 오류: ${e.message}`);
  await cleanup();
  process.exit(2);
});
