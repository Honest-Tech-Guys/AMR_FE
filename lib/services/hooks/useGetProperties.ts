import { PropertyApi } from "@/types/PropertyType";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
const useGetPropertiesList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetPropertiesList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/properties";
      {
        return axiosInstance
          .get<PropertyApi>(url, { params })
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
