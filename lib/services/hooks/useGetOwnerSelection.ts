import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import OwnerType from "@/types/OwnerType";
import ResponseType from "@/types/ResponseType";

const useGetOwnersSelection = () => {
  return useQuery({
    queryKey: ["GetOwnersListSelection"],
    queryFn: () => {
      const url = "/owners-list";
      {
        return axiosInstance
          .get<ResponseType<OwnerType[]>>(url)
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

export default useGetOwnersSelection;
