import axios from '@/api/axios';
import { PaginationParams } from '@/types/pages';
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

  const { data } = await axios.get<PostEntity[]>('/post/filter/mine', {
    params,
  });

  return data;
}

function useGetMyProfilePosts(props: UseGetMyProfilePostsProps) {
  return useQuery<PostEntity[], AxiosError>({
    queryFn: () => getMyProfilePosts(props),
    queryKey: [QUERY_KEY, props.pagination],
  });
}

export { useGetMyProfilePosts, QUERY_KEY as MY_PROFILE_POSTS_QUERY_KEY };
