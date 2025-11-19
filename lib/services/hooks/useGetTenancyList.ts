import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { Tenancy } from "@/types/TenancyType";
interface responseTenancy {
  stats: {
    active: number;
    expiry_soon: number;
    last_month: number;
    total_tenancies: number;
  };
  tenancies: PaginationType<Tenancy[]>;
}
const useGetTenancyList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetTenancyList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/tenancies";
      {
        return axiosInstance
          .get<responseTenancy>(url, { params })
          .then((res) => {
            console.log("SS");
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
export default useGetTenancyList;
