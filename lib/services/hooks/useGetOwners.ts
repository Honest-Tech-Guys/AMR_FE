import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";
import PaginationType from "@/types/PaginationType";

const useGetOwnersList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetOwnersList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/owners";
      {
        return axiosInstance
          .get<PaginationType<OwnerType[]>>(url, { params })
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

export default useGetOwnersList;
