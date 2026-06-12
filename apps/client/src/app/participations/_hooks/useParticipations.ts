import { useQuery } from '@tanstack/react-query';
import { getParticipations } from '@/app/participations/_apis/participations';

export const PARTICIPATIONS_QUERY_KEY = ['participations'] as const;

const useParticipations = () =>
  useQuery({
    queryKey: PARTICIPATIONS_QUERY_KEY,
    queryFn: getParticipations,
  });

export default useParticipations;
