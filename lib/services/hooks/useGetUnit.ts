import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { UnitType } from "@/types/UnitType";
const useGetUnitsList = () => {
  return useQuery({
    queryKey: ["GetUnitsList"],
    queryFn: () => {
      const url = "/units";
      {
        return axiosInstance
          .get<UnitType[]>(url)
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
export default useGetUnitsList;
