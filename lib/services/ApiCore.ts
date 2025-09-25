import axios from "axios";
export const baseUrl = "http://43.217.80.136:8015/api";
const axiosInstance = axios.create({
  baseURL: baseUrl,
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
axiosInstance.interceptors.response.use((response) => {
  return response;
});
axiosInstance.defaults.withCredentials = true;
export default axiosInstance;
