import type { ParticipationsResponse } from '@/app/user/participations/_types/types';
import { apiFetch } from '@/lib/api';

export const getParticipations = () => apiFetch<ParticipationsResponse>('/participations');
