import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";
import ResponseType from "@/types/ResponseType";
import User from "@/types/UserType";

const useGetRoleSelection = (isGet: boolean) => {
  return useQuery({
    queryKey: ["GetRoleSelection"],
    enabled: !!isGet,
    queryFn: () => {
      const url = "/roles/selection-list";
      {
        return axiosInstance
          .get<User[]>(url)
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

export default useGetRoleSelection;
