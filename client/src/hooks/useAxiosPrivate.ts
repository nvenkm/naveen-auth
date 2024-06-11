import axios from "axios";
import { useEffect } from "react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
const useAxiosPrivate = () => {
  useEffect(() => {
    // Add a request interceptor to refresh token before each request
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to refresh token if expired
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/refresh`,
              {
                withCredentials: true,
              }
            );
            localStorage.setItem("token", res.data.accessToken);
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  return api;
};

export default useAxiosPrivate;
