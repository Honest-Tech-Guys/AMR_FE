import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
const useGetNotificationList = () => {
  return useQuery({
    queryKey: ["useGetNotificationList"],
    queryFn: () => {
      const url = "/notifications";
      {
        return axiosInstance
          .get<PaginationType<NotificationType[]>>(url)
          .then((res) => {
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
export default useGetNotificationList;
