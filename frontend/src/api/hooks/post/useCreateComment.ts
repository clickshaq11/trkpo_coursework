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
    onSuccess: () => {
      queryClient.invalidateQueries(composedQueryKeyPost);
      queryClient.invalidateQueries(composedQueryKeyComments);
    },
  });
}

export { useCreateComment };
