import type { Account } from '@/app/add-account/_types/types';
import { apiFetch } from '@/lib/api';

export const getAccounts = () => apiFetch<Account[]>('/accounts');
