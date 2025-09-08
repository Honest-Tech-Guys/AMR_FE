import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetPropertiesList = () => {
  return useQuery({
    queryKey: ["GetPropertiesList"],
    queryFn: () => {
      const url = "/properties";
      {
        return axiosInstance
          .get<PaginationType<Property[]>>(url)
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
export default useGetPropertiesList;
