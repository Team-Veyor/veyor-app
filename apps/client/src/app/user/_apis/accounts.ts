import type { Account } from '@/app/account/_types/types';
import { apiFetch } from '@/lib/api';

export const getAccounts = () => apiFetch<Account[]>('/accounts');
