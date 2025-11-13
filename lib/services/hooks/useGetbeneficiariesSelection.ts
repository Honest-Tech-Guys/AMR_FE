import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";
import ResponseType from "@/types/ResponseType";

const useGetBeneficiariesSelection = (isGet: boolean) => {
  return useQuery({
    queryKey: ["GetBeneficiariesSelection"],
    enabled: !!isGet,
    queryFn: () => {
      const url = "/beneficiaries-list";
      {
        return axiosInstance
          .get<{ id: number; name: string }[]>(url)
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

export default useGetBeneficiariesSelection;
