import axios from '@/api/axios';
import queryClient from '@/api/react-query';
import { PostEntity, PostPageEntity } from '@/types/posts';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { FEED_QUERY_KEY } from '../feed/useGetFeedPosts';
import { produce } from 'immer';
import { POST_QUERY_KEY, getPostQueryKey } from '../post/useGetPost';
import {
  OTHER_PROFILE_POSTS_QUERY_KEY,
  getOtherProfilePostsQueryKey,
} from '../other-profile/useGetOtherProfilePosts';
import { MY_PROFILE_POSTS_QUERY_KEY } from '../my-profile/useGetMyProfilePosts';

async function likePost(id: number) {
  await axios.post(`post/${id}`);
}

interface UseLikeFeedPostVariables {
  currentLikeState: boolean;
  postId: number;
  userId?: number;
}

function useLikePost() {
  const client = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    UseLikeFeedPostVariables,
    PostPageEntity
  >({
    mutationFn: ({ postId }) => likePost(postId),
    onMutate: async ({ currentLikeState, postId, userId }) => {
      await Promise.all([
        client.cancelQueries(FEED_QUERY_KEY),
        client.cancelQueries(POST_QUERY_KEY),
        client.cancelQueries(MY_PROFILE_POSTS_QUERY_KEY),
        client.cancelQueries(OTHER_PROFILE_POSTS_QUERY_KEY),
      ]);

      const previousPostData = queryClient.getQueryData(
        FEED_QUERY_KEY,
      ) as PostPageEntity;

      queryClient.setQueryData<PostEntity[]>(
        FEED_QUERY_KEY,
        produce(draft => {
          if (draft) {
            draft.find(post => post.id === postId)!.hitLike = !currentLikeState;
          }
        }),
      );
      queryClient.setQueryData<PostPageEntity>(
        getPostQueryKey(postId),
        produce(draft => {
          if (draft) {
            draft.hitLike = !currentLikeState;
          }
        }),
      );
      queryClient.setQueryData<PostEntity[]>(
        MY_PROFILE_POSTS_QUERY_KEY,
        produce(draft => {
          if (draft) {
            draft.find(post => post.id === postId)!.hitLike = !currentLikeState;
          }
        }),
      );
      if (userId) {
        queryClient.setQueryData<PostEntity[]>(
          getOtherProfilePostsQueryKey({userId}),
          produce(draft => {
            if (draft) {
              draft.find(post => post.id === postId)!.hitLike =
                !currentLikeState;
            }
          }),
        );
      }

      return previousPostData;
    },
    onSuccess: () => {
      client.invalidateQueries(FEED_QUERY_KEY);
      client.invalidateQueries(POST_QUERY_KEY);
      client.invalidateQueries(MY_PROFILE_POSTS_QUERY_KEY);
      client.invalidateQueries(OTHER_PROFILE_POSTS_QUERY_KEY);
    },
    onError: (_1, _2, context) => {
      // TODO: return query context to prev value for all keys
      queryClient.setQueryData(FEED_QUERY_KEY, context);
    },
  });
}

export { useLikePost };
