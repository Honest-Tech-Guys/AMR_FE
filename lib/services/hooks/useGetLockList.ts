import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import LockType from "@/types/LockType";
interface responseLock {
  stats: {
    total_locks: number;
    active_locks: number;
    low_battery_locks: number;
    total_users: number;
  };
  locks: PaginationType<LockType[]>;
}
const useGetLocksList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetLocksList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/locks";
      {
        return axiosInstance
          .get<responseLock>(url, { params })
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
export default useGetLocksList;
