import { EditableContent, PostEntity } from '@/types/posts';
import { FEED_QUERY_KEY } from './useGetFeedPosts';
import axios from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import queryClient from '@/api/react-query';
import { AxiosError } from 'axios';

async function createNewPost(newPostData: EditableContent) {
  await axios.post<EditableContent>('post', newPostData);
}

function useCreateNewPost() {
  const client = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    EditableContent,
    PostEntity[]
  >({
    mutationFn: (newPostData: EditableContent) => createNewPost(newPostData),
    onMutate: async newPostData => {
      await queryClient.cancelQueries(FEED_QUERY_KEY);

      const previousFeedPosts = queryClient.getQueryData(
        FEED_QUERY_KEY,
      ) as PostEntity[];
      
      const createdPost: PostEntity = {
        ...newPostData,
        id: 0,
        authorId: 0,
        authorLogin: 'Я',
        createdAt: Date.now(),
        likeCounter: 0,
        hitLike: false,
        firstComments: [],
      };

      queryClient.setQueryData<PostEntity[] | undefined>(
        FEED_QUERY_KEY,
        old => {
          if (!old) {
            return [];
          }
          return [createdPost, ...old];
        },
      );

      return previousFeedPosts;
    },
    onSuccess: () => {
      client.invalidateQueries(FEED_QUERY_KEY);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(FEED_QUERY_KEY, context);
    },
  });
}

export { useCreateNewPost };
