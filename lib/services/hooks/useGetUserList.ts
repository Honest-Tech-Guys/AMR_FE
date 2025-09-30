import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";
import PaginationType from "@/types/PaginationType";
import User from "@/types/UserType";

const useGetUserList = () => {
  return useQuery({
    queryKey: ["GetUserList"],
    queryFn: () => {
      const url = "/admins";
      {
        return axiosInstance
          .get<PaginationType<User[]>>(url)
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

export default useGetUserList;
