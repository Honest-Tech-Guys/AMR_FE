import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import PaginationType from "@/types/PaginationType";

const useGetTenantList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetTenantList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/tenants";
      {
        return axiosInstance
          .get<PaginationType<TenantType[]>>(url, { params })
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

export default useGetTenantList;
