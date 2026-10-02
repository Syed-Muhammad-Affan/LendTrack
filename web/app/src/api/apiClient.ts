import axios from 'axios';
import type { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // tells the browser to include cookies on cross-origin requests
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';
    const isAuthRequest = url.startsWith('/auth/');

    // Session expired mid-use on a normal request → send to login.
    // Auth requests are excluded so failed logins and the initial /auth/me
    // check don't trigger a redirect loop.
    if (status === 401 && !isAuthRequest && typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);
