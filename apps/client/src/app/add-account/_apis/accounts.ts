import type { Account, Bank, CreateAccountRequest } from '@/app/add-account/_types/types';
import { apiFetch } from '@/lib/api';

export const getBanks = () => apiFetch<Bank[]>('/accounts/banks');

export const createAccount = (body: CreateAccountRequest) =>
  apiFetch<Account>('/accounts', {
    method: 'post',
    json: body,
  });
