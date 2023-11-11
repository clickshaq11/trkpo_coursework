import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { getOtherProfilePostsQueryKey } from './useGetOtherProfilePosts';
import { ProfileEntity } from '@/types/profiles';
import axios from '@/api/axios';

async function subcribe(userId: number) {
  // TODO: remove
  return new Promise<void>(res => setTimeout(res, 200));

  await axios.post<void>(`subscription/${userId}`);
}

function useSubscribe(userId: number) {
  const queryClient = useQueryClient();
  const composedQueryKey = getOtherProfilePostsQueryKey(userId);

  return useMutation<void, AxiosError, boolean, ProfileEntity>({
    mutationFn: () => subcribe(userId),
    onMutate: async newSubscriptionState => {
      await queryClient.cancelQueries(composedQueryKey);

      const previousState =
        queryClient.getQueryData<ProfileEntity>(composedQueryKey);

      queryClient.setQueryData<ProfileEntity | undefined>(
        composedQueryKey,
        old => {
          if (!old) return old;
          return { ...old, subscribed: !newSubscriptionState };
        },
      );

      return previousState;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(composedQueryKey);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(composedQueryKey, context);
    },
  });
}

export { useSubscribe };
