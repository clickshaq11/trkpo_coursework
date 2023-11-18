import axios from '@/api/axios';
import { PaginationParams } from '@/types/pages';
import { PostEntity } from '@/types/posts';
import { createPaginationSearchParams } from '@/utils/createPaginationSearchParams';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const QUERY_KEY = 'other-profile/posts';

interface UseGetOtherProfilePostsProps {
  pagination: PaginationParams;
  userId: number;
}

async function getOtherProfilePosts({
  userId,
  pagination,
}: UseGetOtherProfilePostsProps) {
  const params = createPaginationSearchParams(pagination, true);

  const { data } = await axios.get<PostEntity[]>(`post/user/${userId}`, {
    params,
  });

  return data;
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

function getOtherProfilePostsQueryKey(props: PartialBy<UseGetOtherProfilePostsProps, 'pagination'>) {
  const pagination = props.pagination ? props.pagination : {}
  return [QUERY_KEY, props.userId, ...Object.values(pagination)];
}

function useGetOtherProfilePosts(props: UseGetOtherProfilePostsProps) {
  return useQuery<PostEntity[], AxiosError>({
    queryFn: () => getOtherProfilePosts(props),
    queryKey: getOtherProfilePostsQueryKey(props),
  });
}

export {
  useGetOtherProfilePosts,
  getOtherProfilePostsQueryKey,
  QUERY_KEY as OTHER_PROFILE_POSTS_QUERY_KEY,
};
