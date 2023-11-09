import axios from '@/api/axios';
import { fakePost } from '@/api/fake-data';
import { PostPageEntity } from '@/types/posts';
import { useQuery } from 'react-query';

const QUERY_KEY = 'post';

interface GetPostDataProps {
  id: number;
  signal?: AbortSignal | undefined;
}

function getPostQueryKey(postId: number) {
  return [QUERY_KEY, postId]
}

async function getPostData({ id, signal }: GetPostDataProps) {
  //TODO: change
  return new Promise<PostPageEntity>(res =>
    setTimeout(() => res(fakePost), 100),
  );

  const { data } = await axios.get(`/post/${id}`, {
    signal,
  });

  return data;
}

function useGetPost(id: number) {
  return useQuery<PostPageEntity, Error>({
    queryKey: getPostQueryKey(id),
    queryFn: ({ signal }) => getPostData({ signal, id }),
    staleTime: 60000,
    keepPreviousData: true,
  });
}

export { useGetPost, getPostQueryKey, QUERY_KEY as POST_QUERY_KEY };
