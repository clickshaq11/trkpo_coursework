import { useQuery } from 'react-query';
import axios from '../../axios';
import { PostEntity } from '@/types/posts';
import { AxiosError } from 'axios';

const QUERY_KEY = 'feed';

interface GetNewsFeedPostsOptions {
  signal?: AbortSignal | undefined;
}

async function getNewsFeedPosts({ signal }: GetNewsFeedPostsOptions) {
  const { data } = await axios.get<PostEntity[]>('post/filter/feed', {
    signal,
  });

  return data;
}

function useGetFeedPosts() {
  return useQuery<PostEntity[], AxiosError>({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => getNewsFeedPosts({ signal }),
    staleTime: 60000,
    keepPreviousData: true,
  });
}

export { useGetFeedPosts, QUERY_KEY as FEED_QUERY_KEY };
