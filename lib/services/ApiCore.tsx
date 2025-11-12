import axios from "axios";
export const baseUrl = "http://43.217.80.136:8015/api";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url !== "/login") {
      const token =
        localStorage.getItem("token") ?? sessionStorage.getItem("token");
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/");
    }
    throw error;
  }
);
export default axiosInstance;
