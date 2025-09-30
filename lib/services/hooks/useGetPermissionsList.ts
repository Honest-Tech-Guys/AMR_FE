import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { PropertyApi } from "@/types/PropertyType";
const useGetPermissionsList = () => {
  return useQuery({
    queryKey: ["useGetPermissionsList"],
    queryFn: () => {
      const url = "/permissions";
      return axiosInstance
        .get(url)
        .then((res) => res.data.data)
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });
};
export default useGetPermissionsList;
