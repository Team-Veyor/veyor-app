import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import { LOGIN_ERROR_MESSAGE } from '@/app/login/_constants/constants';

export const getLoginErrorMessage = (error: unknown): string => {
  if (isAuthRetryableFetchError(error)) {
    return LOGIN_ERROR_MESSAGE.network;
  }

  return LOGIN_ERROR_MESSAGE.default;
};
