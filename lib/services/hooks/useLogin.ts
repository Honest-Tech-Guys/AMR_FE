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
          setUser(res.data.user);
          setIsAuth(true);
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem("token", token);
          return storage;
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.data) {
            throw error.response.data;
          } else if (error.message) {
            throw { message: error.message };
          } else {
            throw { message: "An unexpected error occurred" };
          }
        });
    },
  });
};
export default useLogin;
