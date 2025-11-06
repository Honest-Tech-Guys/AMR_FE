import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { Tenancy } from "@/types/TenancyType";
import ResponseType from "@/types/ResponseType";
const useGetTenancy = (id?: number | null) => {
  return useQuery({
    queryKey: ["GetTenancy", id],
    enabled: Boolean(id),
    queryFn: () => {
      const url = `/tenancies/${id}`;
      {
        return axiosInstance
          .get<ResponseType<Tenancy>>(url)
          .then((res) => {
            return res.data.data;
          })
          .catch((error) => {
            throw error;
          });
      }
    },
  });
};
export default useGetTenancy;
