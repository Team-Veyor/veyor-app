import { useQuery } from '@tanstack/react-query';
import { getHome } from '@/app/home/_apis/home';

// TODO: 쿼리키 일괄 관리
export const HOME_QUERY_KEY = ['home'] as const;
const HOME_REFETCH_INTERVAL_MS = 30_000;

const useHomeQuery = () =>
  useQuery({
    queryKey: HOME_QUERY_KEY,
    queryFn: getHome,
    refetchInterval: HOME_REFETCH_INTERVAL_MS,
  });

export default useHomeQuery;
