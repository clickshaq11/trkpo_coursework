import { router } from '@/config/routes';
import axiosDefaultInstance, { AxiosError } from 'axios';

const axios = axiosDefaultInstance.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-type': 'application/json',
  },
});

axios.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');

    if (token && !config.url?.includes('security')) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Accept'] = 'application/json';
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

axios.interceptors.response.use(
  config => config,
  (error: AxiosError) => {
    if (error.code === '401') {
      router.navigate('login');
    }
    throw error
  },
);

export default axios;
