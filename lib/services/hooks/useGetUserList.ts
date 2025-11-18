import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";
import PaginationType from "@/types/PaginationType";
import User from "@/types/UserType";

const useGetUserList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetUserList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/admins";
      {
        return axiosInstance
          .get<PaginationType<User[]>>(url, { params })
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
