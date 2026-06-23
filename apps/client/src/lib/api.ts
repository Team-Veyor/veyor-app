import ky, { type KyInstance, type Options } from 'ky';
import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');
const RETRY_COUNT = 1;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

type ApiErrorBody = {
  message?: unknown;
  code?: unknown;
};

export class ApiError extends Error {
  status: number;
  /** 서버가 내려준 머신리더블 사유 코드(있을 때만). 상태코드 대신 안정적인 분기 기준. */
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type ApiInstanceOptions = {
  includeAuth?: boolean;
  includeJsonHeaders?: boolean;
};

const setAuthorizationHeader = async (requestOrState: Request | { request: Request }) => {
  const request = requestOrState instanceof Request ? requestOrState : requestOrState.request;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
};

const createApiInstance = ({
  includeAuth = false,
  includeJsonHeaders = true,
}: ApiInstanceOptions = {}): KyInstance =>
  ky.create({
    headers: includeJsonHeaders ? JSON_HEADERS : undefined,
    hooks: includeAuth
      ? {
          beforeRequest: [setAuthorizationHeader],
        }
      : undefined,
    retry: {
      limit: RETRY_COUNT,
    },
  });

export const instance = createApiInstance();

export const tokenInstance = createApiInstance({
  includeAuth: true,
});

export const formDataInstance = createApiInstance({
  includeAuth: true,
  includeJsonHeaders: false,
});

const redirectToLogin = async () => {
  await supabase.auth.signOut();

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

const getApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    throw new Error('Missing API base URL environment variable.');
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

export const apiFetch = async <T>(path: string, options: Options = {}): Promise<T> => {
  const response = await tokenInstance(getApiUrl(path), {
    ...options,
    throwHttpErrors: false,
  });

  if (response.status === 401) {
    await redirectToLogin();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorBody: ApiErrorBody = await response.json<ApiErrorBody>().catch(() => ({}));
    throw new ApiError(
      response.status,
      typeof errorBody.message === 'string' ? errorBody.message : `API ${response.status}`,
      typeof errorBody.code === 'string' ? errorBody.code : undefined,
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json<T>();
};
