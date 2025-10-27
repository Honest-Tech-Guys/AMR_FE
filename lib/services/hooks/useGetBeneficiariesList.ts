import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import ResponseType from "@/types/ResponseType";
import BeneficiaryType from "@/types/BeneficiaryType";

const useGetBeneficiariesList = () => {
  return useQuery({
    queryKey: ["useGetBeneficiariesList"],
    queryFn: () => {
      const url = "/beneficiaries";
      {
        return axiosInstance
          .get<ResponseType<BeneficiaryType[]>>(url)
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

export default useGetBeneficiariesList;
