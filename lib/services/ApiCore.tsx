import axios from "axios";
export const baseUrl = "http://43.217.80.136:8015/api";
import { toast } from "sonner";
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
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    toast.error(
      error && (
        <div className=" text-red-600 rounded-md px-2">
          {(error as any)?.response &&
            Object.values((error as any).response?.data?.errors)
              .flat()
              .map((err: any, index: number) => {
                console.log(err);
                return <div key={index}>{err}</div>;
              })}
          {(error as any).response?.data?.message}
          {(error as any)?.message}
        </div>
      )
    );
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/");
    }

    return error;
  }
);
axiosInstance.defaults.withCredentials = true;
export default axiosInstance;
