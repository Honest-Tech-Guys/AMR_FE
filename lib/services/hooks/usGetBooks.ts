import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import ResponseType from "@/types/ResponseType";
import { Book } from "@/types/BookType";
const useGetBooksList = () => {
  return useQuery({
    queryKey: ["GetBooksList"],
    queryFn: () => {
      const url = "/bookings";
      {
        return axiosInstance
          .get<ResponseType<Book[]>>(url)
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
export default useGetBooksList;
