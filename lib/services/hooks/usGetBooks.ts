import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { Book } from "@/types/BookType";
import PaginationType from "@/types/PaginationType";
const useGetBooksList = (params: Object) => {
  const isParamsValid = Object.keys(params).length > 0;
  return useQuery({
    queryKey: ["GetBooksList", params],
    enabled: isParamsValid,
    queryFn: () => {
      const url = "/bookings";
      {
        return axiosInstance
          .get<PaginationType<Book[]>>(url, { params })
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
export default useGetBooksList;
