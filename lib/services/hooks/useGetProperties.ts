import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { PropertyType } from "@/types/PropertyType";
const useGetPropertiesList = () => {
  return useQuery({
    queryKey: ["GetPropertiesList"],
    queryFn: () => {
      const url = "/properties";
      {
        return axiosInstance
          .get<PropertyType[]>(url)
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
export default useGetPropertiesList;
