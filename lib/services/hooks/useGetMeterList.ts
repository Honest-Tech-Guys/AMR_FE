import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import PaginationType from "@/types/PaginationType";
const useGetMetersList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetMetersList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/meters";
      {
        return axiosInstance
          .get<PaginationType<Meter[]>>(url, { params })
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
export default useGetMetersList;
