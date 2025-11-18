import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import ResponseType from "@/types/ResponseType";
import BeneficiaryType from "@/types/BeneficiaryType";
import PaginationType from "@/types/PaginationType";

const useGetBeneficiariesList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["useGetBeneficiariesList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/beneficiaries";
      {
        return axiosInstance
          .get<PaginationType<BeneficiaryType[]>>(url, { params })
          .then((res) => {
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

export default useGetBeneficiariesList;
