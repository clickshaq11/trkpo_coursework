import axios from '@/api/axios';
import { EditableContent, PostPageEntity } from '@/types/posts';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { POST_QUERY_KEY } from './useGetPost';

interface UpdatePostProps {
  postId: number;
  body: string;
  title: string;
}

async function updatePost({ postId, body, title }: UpdatePostProps) {
  await axios.put<void>(`post/${postId}`, {
    body,
    title,
  });
}

function useUpdatePost(postId: number) {
  const queryClient = useQueryClient();
  const composedQueryKey = [POST_QUERY_KEY, postId];

  return useMutation<void, AxiosError, EditableContent, PostPageEntity>({
    mutationFn: vars => updatePost({ ...vars, postId }),
    onMutate: async updatedPost => {
      await queryClient.cancelQueries(composedQueryKey);

      const previousPostData = queryClient.getQueryData(
        composedQueryKey,
      ) as PostPageEntity;

      queryClient.setQueryData<PostPageEntity | undefined>(
        composedQueryKey,
        old => {
          if (!old) return old;
          return {
            ...old,
            ...updatedPost,
          };
        },
      );

      return previousPostData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(composedQueryKey);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(composedQueryKey, context);
    },
  });
}

export { useUpdatePost };
