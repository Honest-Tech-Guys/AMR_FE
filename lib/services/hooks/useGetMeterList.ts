import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetMetersList = () => {
  return useQuery({
    queryKey: ["GetMetersList"],
    queryFn: () => {
      const url = "/meters";
      {
        return axiosInstance
          .get<PaginationType<Meter[]>>(url)
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
export default useGetMetersList;
