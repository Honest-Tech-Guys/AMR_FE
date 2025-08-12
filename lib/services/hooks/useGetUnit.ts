import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { UnitType } from "@/types/UnitType";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetUnitsList = () => {
  return useQuery({
    queryKey: ["GetUnitsList"],
    queryFn: () => {
      const url = "/units";
      {
        return axiosInstance
          .get<ResponseType<PaginationType<UnitType[]>>>(url)
          .then((res) => {
            return res.data.data.data;
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      }
    },
  });
};
export default useGetUnitsList;
