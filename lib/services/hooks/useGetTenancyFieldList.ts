import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
const useGetTenancyFieldList = () => {
  return useQuery({
    queryKey: ["GetTenancyFieldList"],
    queryFn: () => {
      const url = "/tenancies-list";
      {
        return axiosInstance
          .get(url)
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
export default useGetTenancyFieldList;
