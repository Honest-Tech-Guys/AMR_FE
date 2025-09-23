import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetPropertiesList = (params: Object) => {
  return useQuery({
    queryKey: ["GetPropertiesList", params],
    queryFn: () => {
      const url = "/properties";
      {
        return axiosInstance
          .get<PaginationType<Property[]>>(url, { params })
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
export default useGetPropertiesList;
