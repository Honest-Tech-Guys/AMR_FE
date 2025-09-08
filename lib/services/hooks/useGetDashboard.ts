import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
const useGetDashboard = () => {
  return useQuery({
    queryKey: ["useGetDashboard"],
    queryFn: () => {
      const url = "/dashboard";
      {
        return axiosInstance
          .get<Dashboard>(url)
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
export default useGetDashboard;
