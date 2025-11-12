import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import ResponseType from "@/types/ResponseType";

const useGetTenantByEmail = (email: string) => {
  return useQuery({
    queryKey: ["useGetTenantByEmail", email],
    enabled: !!email,
    queryFn: () => {
      const url = `/search-tenants-by-email?email=${email}`;
      {
        return axiosInstance
          .get<ResponseType<TenantType[]>>(url)
          .then((res) => {
            return res.data.data[0];
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      }
    },
  });
};

export default useGetTenantByEmail;
