import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import PaginationType from "@/types/PaginationType";
import { AgreementType } from "@/types/AgreementType";
interface Response {
  data: AgreementType;
  message: string;
}
const useGetLatestAgreement = () => {
  return useQuery({
    queryKey: ["GetAgreementList"],
    queryFn: () => {
      const url = "/agreement/my-latest-agreement";
      {
        return axiosInstance
          .get<Response>(url)
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
export default useGetLatestAgreement;
