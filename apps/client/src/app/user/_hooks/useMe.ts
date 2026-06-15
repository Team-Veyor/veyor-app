import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/app/user/_apis/users';

export const ME_QUERY_KEY = ['me'] as const;

const useMe = () => {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
  });
};

export default useMe;
