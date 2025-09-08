import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import ResponseType from "@/types/ResponseType";

const useGetTenantsList = () => {
  return useQuery({
    queryKey: ["GetTenantsList"],
    queryFn: () => {
      const url = "/tenants-list";
      {
        return axiosInstance
          .get<ResponseType<TenantType[]>>(url)
          .then((res) => {
            return res.data.data;
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
