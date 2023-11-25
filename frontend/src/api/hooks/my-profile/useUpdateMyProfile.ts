import axios from '@/api/axios';
import { EditProfileEntity, MyProfileEntity } from '@/types/profiles';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { MY_PROFILE_QUERY_KEY } from './useGetMyProfile';

async function updateMyProfile(data: EditProfileEntity) {
  await axios.put('user', data);
}

function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, EditProfileEntity, MyProfileEntity>({
    mutationFn: updateMyProfile,
    onMutate: async ({ shortInfo }) => {
      await queryClient.cancelQueries(MY_PROFILE_QUERY_KEY);

      const prevProfileData =
        queryClient.getQueryData<MyProfileEntity>(MY_PROFILE_QUERY_KEY);

      queryClient.setQueryData<MyProfileEntity | undefined>(
        MY_PROFILE_QUERY_KEY,
        old => {
          if (!old) return old;
          return { ...old, shortInfo };
        },
      );

      return prevProfileData;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(MY_PROFILE_QUERY_KEY);
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, context);
    },
  });
}

export { useUpdateMyProfile };
