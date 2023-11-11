import axios from '@/api/axios';
import { fakeNewsFeedPosts } from '@/api/fake-data';
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
  // TODO: remove
  return new Promise<PostEntity[]>(res =>
    setTimeout(() => res(fakeNewsFeedPosts), 100),
  );

  const params = createPaginationSearchParams(pagination);

  const { data } = await axios.get<PostEntity[]>(`post/user/${userId}`, {
    params,
  });

  return data;
}

function getOtherProfilePostsQueryKey(userId: number) {
  return [QUERY_KEY, userId];
}

function useGetOtherProfilePosts(props: UseGetOtherProfilePostsProps) {
  return useQuery<PostEntity[], AxiosError>({
    queryFn: () => getOtherProfilePosts(props),
    queryKey: getOtherProfilePostsQueryKey(props.userId),
  });
}

export {
  useGetOtherProfilePosts,
  getOtherProfilePostsQueryKey,
  QUERY_KEY as OTHER_PROFILE_POSTS_QUERY_KEY,
};
