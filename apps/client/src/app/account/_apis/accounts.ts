import type {
  Account,
  Bank,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/app/account/_types/types';
import { apiFetch } from '@/lib/api';

export const getBanks = () => apiFetch<Bank[]>('/accounts/banks');

export const createAccount = (body: CreateAccountRequest) =>
  apiFetch<Account>('/accounts', {
    method: 'post',
    json: body,
  });

export const updateAccount = (id: string, body: UpdateAccountRequest) =>
  apiFetch<Account>(`/accounts/${id}`, {
    method: 'patch',
    json: body,
  });

export const setPrimaryAccount = (id: string) =>
  apiFetch<Pick<Account, 'id' | 'isPrimary'>>(`/accounts/${id}/primary`, {
    method: 'patch',
  });

export const deleteAccount = (id: string) =>
  apiFetch<{ deleted: boolean }>(`/accounts/${id}`, {
    method: 'delete',
  });
