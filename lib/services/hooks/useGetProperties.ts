import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { PropertyType } from "@/types/PropertyType";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetPropertiesList = () => {
  return useQuery({
    queryKey: ["GetPropertiesList"],
    queryFn: () => {
      const url = "/properties";
      {
        return axiosInstance
          .get<ResponseType<PaginationType<PropertyType[]>>>(url)
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
export default useGetPropertiesList;
