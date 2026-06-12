import type { ParticipationsResponse } from '@/app/participations/_types/types';
import { apiFetch } from '@/lib/api';

export const getParticipations = () => apiFetch<ParticipationsResponse>('/participations');
