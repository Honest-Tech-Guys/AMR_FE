import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import PaginationType from "@/types/PaginationType";
import { NotificationsAPI } from "@/types/NotificationType";
const useGetNotificationList = () => {
  return useQuery({
    queryKey: ["useGetNotificationList"],
    queryFn: () => {
      const url = "/notifications";
      {
        return axiosInstance
          .get<NotificationsAPI>(url)
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
export default useGetNotificationList;
