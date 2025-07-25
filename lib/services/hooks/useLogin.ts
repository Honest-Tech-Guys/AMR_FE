import { useMutation } from "@tanstack/react-query";
import LoginModel from "@/types/LoginModelType";
import axiosInstance from "../ApiCore";
import { useAuthStore } from "@/lib/stores/authStore";

const useLogin = () => {
  const { setIsAuth, setUser } = useAuthStore();
  return useMutation({
    mutationKey: ["Login"],
    mutationFn: (AdminLogin: LoginModel) => {
      const { email, password, rememberMe } = AdminLogin;
      return axiosInstance
        .post(
          "/login",
          {
            email: email,
            password: password,
          },
          { withCredentials: true }
        )
        .then((res) => {
          const token = res.data.data.token;
          console.log("Login response:", res.data.data);
          // Store user and partner in Zustand authStore (which will persist it)
          setIsAuth(true);
          setUser(res.data.data.user);
          // Store token for axios request authorization header
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem("token", token);

          return storage;
        })
        .catch((error) => {
          throw error.response.data;
        });
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
export default useLogin;
