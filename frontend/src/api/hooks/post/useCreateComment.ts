import axios from '@/api/axios';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import {
  GetPostCommentProps,
  getPostCommentsQueryKey,
} from './useGetPostComments';
import { Comment } from '@/types/comments';
import { getPostQueryKey } from './useGetPost';

interface CreateCommentProps {
  postId: number;
  body: string;
}

async function createComment({ postId, body }: CreateCommentProps) {
  await axios.post<void>(`post/${postId}/comment`, {
    body,
  });
}

function useCreateComment(props: GetPostCommentProps) {
  const queryClient = useQueryClient();
  const composedQueryKeyPost = getPostQueryKey(props.postId)
  const composedQueryKeyComments = getPostCommentsQueryKey(props);

  return useMutation<void, AxiosError, CreateCommentProps, Comment[]>({
    mutationFn: createComment,
    onMutate: async newCommentData => {
      await queryClient.cancelQueries(composedQueryKeyPost);
      await queryClient.cancelQueries(composedQueryKeyComments);

      const previousComments = queryClient.getQueryData(
        composedQueryKeyComments,
      ) as Comment[];

      const createdComment: Comment = {
        ...newCommentData,
        id: 0,
        authorLogin: 'Я',
      };

      queryClient.setQueryData<Comment[] | undefined>(composedQueryKeyComments, old => {
        if (!old) {
          return [createdComment];
        }
        return [...old, createdComment];
      });

      return previousComments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(composedQueryKeyPost);
      queryClient.invalidateQueries(composedQueryKeyComments);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(composedQueryKeyComments, context);
    },
  });
}

export { useCreateComment };
