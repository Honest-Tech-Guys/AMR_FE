import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import User from "@/types/UserType";
const useGetProfile = () => {
  return useQuery({
    queryKey: ["GetProfile"],
    queryFn: () => {
      const url = "/profile";
      {
        return axiosInstance
          .get<User>(url)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      }
    },
  });
};
export default useGetProfile;
