import axios from '@/api/axios';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import {
  GetPostCommentProps,
  getPostCommentsQueryKey,
} from './useGetPostComments';
import { Comment } from '@/types/comments';

interface CreateCommentProps {
  postId: number;
  body: string;
}

async function createComment({ postId, body }: CreateCommentProps) {
  // TODO: remove
  await new Promise<void>(res => setTimeout(res, 200));
  return;

  await axios.post<void>(`post/${postId}/comment`, {
    body,
  });
}

function useCreateComment(props: GetPostCommentProps) {
  const queryClient = useQueryClient();
  const composedQueryKey = getPostCommentsQueryKey(props);

  return useMutation<void, AxiosError, CreateCommentProps, Comment[]>({
    mutationFn: createComment,
    onMutate: async newCommentData => {
      await queryClient.cancelQueries(composedQueryKey);

      const previousComments = queryClient.getQueryData(
        composedQueryKey,
      ) as Comment[];

      const createdComment: Comment = {
        ...newCommentData,
        id: 0,
        authorLogin: 'Я',
      };

      queryClient.setQueryData<Comment[] | undefined>(composedQueryKey, old => {
        if (!old) {
          return [createdComment];
        }
        return [createdComment, ...old];
      });

      return previousComments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(composedQueryKey);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(composedQueryKey, context);
    },
  });
}

export { useCreateComment };
