import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from "@/shared/constants";
import axios from "axios";

/**
 * Global axios instance (Singleton) that intercepts requests and adds
 * the current Auth token (from local storage).
 */
const axiosInstance = axios.create({
  baseURL: "",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
