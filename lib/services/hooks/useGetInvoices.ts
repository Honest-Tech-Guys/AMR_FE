import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { Invoice } from "@/types/InvoiceType";
const useGetInvoicesList = () => {
  return useQuery({
    queryKey: ["GetInvoicesList"],
    queryFn: () => {
      const url = "/invoices";
      {
        return axiosInstance
          .get<PaginationType<Invoice[]>>(url)
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
export default useGetInvoicesList;
