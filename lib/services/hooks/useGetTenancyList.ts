import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { Tenancy } from "@/types/TenancyType";
const useGetTenancyList = () => {
  return useQuery({
    queryKey: ["GetTenancyList"],
    queryFn: () => {
      const url = "/tenancies";
      {
        return axiosInstance
          .get<PaginationType<Tenancy[]>>(url)
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
