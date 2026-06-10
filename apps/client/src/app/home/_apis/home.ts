import type { HomeResponse } from '@/app/home/types/types';
import { apiFetch } from '@/lib/api';

export const getHome = () => apiFetch<HomeResponse>('/home');
