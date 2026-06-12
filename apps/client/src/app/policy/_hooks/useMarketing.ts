import { useMutation, useQueryClient } from '@tanstack/react-query';
import patchMarketing from '@/app/policy/_apis/marketing';
import { CONSENTS_QUERY_KEY } from '@/app/policy/_hooks/useConsents';
import type { Consent } from '@/app/policy/_types/types';

const useMarketing = () => {
  const queryClient = useQueryClient();

  return useMutation<Consent, Error, boolean, { previous?: Consent[] }>({
    mutationFn: patchMarketing,
    onMutate: async (agreed) => {
      await queryClient.cancelQueries({ queryKey: CONSENTS_QUERY_KEY });

      const previous = queryClient.getQueryData<Consent[]>(CONSENTS_QUERY_KEY);

      queryClient.setQueryData<Consent[]>(CONSENTS_QUERY_KEY, (consents) =>
        consents?.map((consent) =>
          consent.type === 'marketing' ? { ...consent, agreed } : consent,
        ),
      );

      return { previous };
    },
    onError: (_error, _agreed, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CONSENTS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CONSENTS_QUERY_KEY });
    },
  });
};

export default useMarketing;
