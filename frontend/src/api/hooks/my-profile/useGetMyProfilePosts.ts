import axios from '@/api/axios';
import { PaginationParams, PaginationResponse } from '@/types/pages';
import { PostEntity } from '@/types/posts';
import { createPaginationSearchParams } from '@/utils/createPaginationSearchParams';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const QUERY_KEY = 'my-profile/posts';

interface UseGetMyProfilePostsProps {
  pagination: PaginationParams;
}

async function getMyProfilePosts({ pagination }: UseGetMyProfilePostsProps) {
  const params = createPaginationSearchParams(pagination, true);

  const { data } = await axios.get<PaginationResponse<PostEntity[]>>(
    '/post/filter/mine',
    {
      params,
    },
  );

  return data;
}

function getMyProfileQueryKey(pagination: PaginationParams) {
  return [QUERY_KEY, pagination];
}

function useGetMyProfilePosts(props: UseGetMyProfilePostsProps) {
  return useQuery<PaginationResponse<PostEntity[]>, AxiosError>({
    queryFn: () => getMyProfilePosts(props),
    queryKey: getMyProfileQueryKey(props.pagination),
  });
}

export { useGetMyProfilePosts, QUERY_KEY as MY_PROFILE_POSTS_QUERY_KEY };
