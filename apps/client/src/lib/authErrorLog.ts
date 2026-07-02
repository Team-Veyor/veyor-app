export type AuthErrorStage =
  | 'oauth_start'
  | 'oauth_redirect'
  | 'exchange_code'
  | 'missing_session'
  | 'fetch_user'
  | 'unknown';

type AuthErrorLogInput = {
  stage: AuthErrorStage;
  provider?: 'kakao';
  error?: unknown;
  urlParams?: URLSearchParams;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

const getErrorValue = (error: unknown, key: 'name' | 'message' | 'status' | 'code') => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const value = (error as Record<string, unknown>)[key];
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return undefined;
};

export const logAuthClientError = async ({
  stage,
  provider = 'kakao',
  error,
  urlParams,
}: AuthErrorLogInput) => {
  if (!API_BASE_URL) {
    return;
  }

  const payload = {
    stage,
    provider,
    name: getErrorValue(error, 'name'),
    message: error instanceof Error ? error.message : getErrorValue(error, 'message'),
    status: getErrorValue(error, 'status'),
    errorCode: getErrorValue(error, 'code'),
    urlError: urlParams?.get('error') ?? undefined,
    urlErrorCode: urlParams?.get('error_code') ?? undefined,
    urlErrorDescription: urlParams?.get('error_description') ?? undefined,
    path: typeof window === 'undefined' ? undefined : window.location.pathname,
    userAgent: typeof navigator === 'undefined' ? undefined : navigator.userAgent,
  };

  await fetch(`${API_BASE_URL}/auth/client-error`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
};
