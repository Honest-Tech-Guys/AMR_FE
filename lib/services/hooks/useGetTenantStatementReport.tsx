import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import ResponseType from "@/types/ResponseType";
import { TenantStatementReport } from "@/types/TenetStatementReport";
interface tenetReport {
  data: ResponseType<TenantStatementReport[]>;
  message: string;
}
const useGetTenantStatementReport = () => {
  return useQuery({
    queryKey: ["useGetTenantStatementReport"],
    queryFn: () => {
      const url = "/reports/tenant-account-summary";
      {
        return axiosInstance
          .get<tenetReport>(url)
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
