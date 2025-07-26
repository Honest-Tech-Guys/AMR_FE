import { useMutation } from "@tanstack/react-query";
import LoginModel from "@/types/LoginModelType";
import axiosInstance from "../ApiCore";
import { useAuthStore } from "@/lib/stores/authStore";

const useLogin = () => {
  const { setIsAuth, setUser, isAuth } = useAuthStore();
  return useMutation({
    mutationKey: ["Login"],
    mutationFn: (AdminLogin: LoginModel) => {
      const { email, password, rememberMe } = AdminLogin;
      return axiosInstance
        .post("/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          const token = res.data.token;
          console.log("Login response:", res.data);
          // Store user and partner in Zustand authStore (which will persist it)
          setUser(res.data.user);
          // Store token for axios request authorization header
          setIsAuth(true);
          console.log(isAuth);
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem("token", token);

          return storage;
        })
        .catch((error) => {
          // Handle different types of errors
          if (error.response && error.response.data) {
            throw error.response.data;
          } else if (error.message) {
            throw { message: error.message };
          } else {
            throw { message: "An unexpected error occurred" };
          }
        });
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
export default useLogin;
