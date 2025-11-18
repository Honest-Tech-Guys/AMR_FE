import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import ResponseType from "@/types/ResponseType";
import { TenantStatementReport } from "@/types/TenetStatementReport";
import PaginationType from "@/types/PaginationType";

const useGetTenantStatementReport = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["useGetTenantStatementReport", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/reports/tenant-account-summary";
      {
        return axiosInstance
          .get<ResponseType<PaginationType<TenantStatementReport[]>>>(url, {
            params,
          })
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

export default useGetTenantStatementReport;
