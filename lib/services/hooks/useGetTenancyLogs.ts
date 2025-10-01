import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { PropertyApi } from "@/types/PropertyType";
import { ActivityLog } from "@/types/LogsType";
type SummaryItem = {
  amount: number;
  count: number;
};

type PaymentSummary = {
  total_collected: SummaryItem;
  total_pending: SummaryItem;
  total_overdue: SummaryItem;
  total_paid: SummaryItem;
};

const useGetTenancyLogs = (id: number) => {
  return useQuery({
    queryKey: ["GetTenancyLogs"],
    queryFn: () => {
      const url = `/tenancies/${id}/audit-logs`;
      {
        return axiosInstance
          .get<PaginationType<ActivityLog[]>>(url)
          .then((res) => {
            console.log("SS");
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
export default useGetTenancyLogs;
