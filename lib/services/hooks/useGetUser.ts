import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
const useGetUser = () => {
  return useQuery({
    queryKey: ["GetUser"],
    queryFn: () => {
      const url = "/user";
      {
        return axiosInstance
          .get<User>(url)
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
export default useGetUser;
