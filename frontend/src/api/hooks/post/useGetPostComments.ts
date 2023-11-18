import axios from '@/api/axios';
import { Comment } from '@/types/comments';
import { PaginationParams } from '@/types/pages';
import { createPaginationSearchParams } from '@/utils/createPaginationSearchParams';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const QUERY_KEY = 'post/comments';

interface GetPostCommentProps {
  pagination: PaginationParams;
  postId: number;
}

async function getPostComments({ postId, pagination }: GetPostCommentProps) {
  const params = createPaginationSearchParams(pagination);

  const { data } = await axios.get<Comment[]>(`post/${postId}/comment`, {
    params,
  });

  return data;
}

function getPostCommentsQueryKey(params: GetPostCommentProps) {
  return [QUERY_KEY, ...Object.entries(params)];
}

function useGetPostComments(params: GetPostCommentProps) {
  return useQuery<Comment[], AxiosError>({
    queryFn: () => getPostComments(params),
    queryKey: getPostCommentsQueryKey(params),
  });
}

export {
  useGetPostComments,
  getPostCommentsQueryKey,
  QUERY_KEY as POST_COMMENTS_QUERY_KEY,
};
export type { GetPostCommentProps };
