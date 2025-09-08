import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetLocksList = () => {
  return useQuery({
    queryKey: ["GetLocksList"],
    queryFn: () => {
      const url = "/locks";
      {
        return axiosInstance
          .get<PaginationType<Locks[]>>(url)
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
export default useGetLocksList;
