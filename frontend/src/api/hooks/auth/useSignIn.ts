import axios from '@/api/axios';
import { AuthResponse, LoginFields } from '@/types/auth';
import { AxiosErrorMessage } from '@/types/error';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { NavigateFunction } from 'react-router-dom';

async function signIn({ login, password }: LoginFields) {
  const { data } = await axios.post<AuthResponse>('security/auth', {
    login,
    password,
  });

  return data;
}

function useSignIn(navigate: NavigateFunction) {
  return useMutation<AuthResponse, AxiosError<AxiosErrorMessage>, LoginFields>({
    mutationFn: signIn,
    onSuccess: response => {
      localStorage.setItem('token', response.token);
      navigate('/');
    },
  });
}

export { useSignIn };
