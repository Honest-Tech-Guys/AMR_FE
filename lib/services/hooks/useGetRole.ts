import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
const useGetRole = () => {
  return useQuery({
    queryKey: ["GetRole"],
    queryFn: () => {
      const url = "/roles";
      {
        return axiosInstance
          .get<Role[]>(url)
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
export default useGetRole;
