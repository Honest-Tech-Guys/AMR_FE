import RegisterModel from "@/types/RegisterModelType";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

const useRegister = () => {
  return useMutation({
    mutationKey: ["Register"],
    mutationFn: (AdminLogin: RegisterModel) => {
      const { email, password, name, role } = AdminLogin;
      return axiosInstance
        .post("/register", {
          name: name,
          email: email,
          password: password,
          password_confirmation: password,
          role: role,
        })
        .then((res) => {
          return res.data;
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
export default useRegister;
