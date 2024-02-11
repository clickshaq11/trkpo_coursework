import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { getOtherProfilePostsQueryKey } from './useGetOtherProfilePosts';
import { ProfileEntity } from '@/types/profiles';
import axios from '@/api/axios';
import { getOtherProfileQueryKey } from './useGetOtherProfile';

async function subscribe(userId: number) {
  await axios.post<void>(`subscription/${userId}`);
}

function useSubscribe(userId: number) {
  const queryClient = useQueryClient();
  const composedPostsQueryKey = getOtherProfilePostsQueryKey({ userId });
  const composedProfileQueryKey = getOtherProfileQueryKey(userId);

  return useMutation<void, AxiosError, boolean, ProfileEntity>({
    mutationFn: () => subscribe(userId),
    onMutate: async newSubscriptionState => {
      await queryClient.cancelQueries(composedPostsQueryKey);
      await queryClient.cancelQueries(composedProfileQueryKey);

      const previousStateProfile = queryClient.getQueryData<ProfileEntity>(
        composedProfileQueryKey,
      );

      queryClient.setQueryData<ProfileEntity | undefined>(
        composedProfileQueryKey,
        old => {
          if (!old) return old;
          return { ...old, subscribed: !newSubscriptionState };
        },
      );

      return previousStateProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(composedPostsQueryKey);
      queryClient.invalidateQueries(composedProfileQueryKey);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(composedProfileQueryKey, context);
    },
  });
}

export { useSubscribe };
