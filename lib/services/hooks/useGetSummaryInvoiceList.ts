import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { PropertyApi } from "@/types/PropertyType";
type SummaryItem = {
  amount: number;
  count: number;
};

type PaymentSummary = {
  total_invoice: SummaryItem;
  total_coming_due: SummaryItem;
  total_overdue: SummaryItem;
  total_paid: SummaryItem;
};

const useGetSummaryInvoiceList = (id: number) => {
  return useQuery({
    queryKey: ["GetSummaryInvoiceList"],
    queryFn: () => {
      const url = `/tenancies/${id}/invoice-summary`;
      {
        return axiosInstance
          .get<PaymentSummary>(url)
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
export default useGetSummaryInvoiceList;
