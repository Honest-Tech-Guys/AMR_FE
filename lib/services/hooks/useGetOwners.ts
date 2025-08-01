import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";

const useGetOwnersList = () => {
  return useQuery({
    queryKey: ["GetOwnersList"],
    queryFn: () => {
      const url = "/owners";
      {
        return axiosInstance
          .get<OwnerType[]>(url)
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

export default useGetOwnersList;
