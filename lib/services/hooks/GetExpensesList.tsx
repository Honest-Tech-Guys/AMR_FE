import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { Invoice } from "@/types/InvoiceType";
const GetExpensesList = () => {
  return useQuery({
    queryKey: ["GetExpensesList"],
    queryFn: () => {
      const url = "/expenses";
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
export default GetExpensesList;
