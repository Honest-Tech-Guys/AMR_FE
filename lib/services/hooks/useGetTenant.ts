import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";

const useGetTenantsList = () => {
  return useQuery({
    queryKey: ["GetTenantsList"],
    queryFn: () => {
      const url = "/tenants";
      {
        return axiosInstance
          .get<TenantType[]>(url)
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

export default useGetTenantsList;
