import { EditableContent } from '@/types/posts';
import axios from '../../axios';
import { useMutation, useQueryClient } from 'react-query';
import queryClient from '@/api/react-query';
import { AxiosError } from 'axios';
import { MY_PROFILE_POSTS_QUERY_KEY } from '../my-profile/useGetMyProfilePosts';

async function createNewPost(newPostData: EditableContent) {
  await axios.post<EditableContent>('post', newPostData);
}

function useCreateNewPost() {
  const client = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    EditableContent,
    void
  >({
    mutationFn: (newPostData: EditableContent) => createNewPost(newPostData),
    onMutate: async () => {
      await queryClient.cancelQueries(MY_PROFILE_POSTS_QUERY_KEY);
    },
    onSuccess: () => {
      client.invalidateQueries(MY_PROFILE_POSTS_QUERY_KEY);
    },
  });
}

export { useCreateNewPost };
