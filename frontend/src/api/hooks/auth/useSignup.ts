import axios from '@/api/axios';
import { AuthResponse, RegisterFields } from '@/types/auth';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { NavigateFunction } from 'react-router-dom';

type RegisterRequestFields = Omit<RegisterFields, 'repeatPassword'>;

async function signUp({ password, login, shortInfo }: RegisterRequestFields) {
  // TODO: remove
  return new Promise<AuthResponse>(res =>
    setTimeout(() => res({ token: 'sadfsa ujftusangunmsag' })),
  );

  const { data } = await axios.post<AuthResponse>('security/register', {
    password,
    login,
    shortInfo,
  });

  return data;
}

function useSignup(navigate: NavigateFunction) {
  return useMutation<AuthResponse, AxiosError, RegisterRequestFields>({
    mutationFn: signUp,
    onSuccess: response => {
      localStorage.setItem('token', response.token);
      navigate('/');
    },
  });
}

export { useSignup };
