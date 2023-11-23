import axios from '@/api/axios';
import { PostPageEntity } from '@/types/posts';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { FEED_QUERY_KEY } from '../feed/useGetFeedPosts';
import { POST_QUERY_KEY } from '../post/useGetPost';
import { OTHER_PROFILE_POSTS_QUERY_KEY } from '../other-profile/useGetOtherProfilePosts';
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
    onSuccess: () => {
      client.invalidateQueries(FEED_QUERY_KEY);
      client.invalidateQueries(POST_QUERY_KEY);
      client.invalidateQueries(MY_PROFILE_POSTS_QUERY_KEY);
      client.invalidateQueries(OTHER_PROFILE_POSTS_QUERY_KEY);
    },
  });
}

export { useLikePost };
