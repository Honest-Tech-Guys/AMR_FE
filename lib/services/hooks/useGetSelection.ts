import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
type Room = {
  id: number;
  unit_id: number;
  name: string;
};

type Unit = {
  id: number;
  property_id: number;
  block_floor_unit_number: string;
  rooms: Room[];
};

export type PropertySelection = {
  id: number;
  property_name: string;
  units: Unit[];
};

type PropertiesResponse = PropertySelection[];

const useGetSelection = () => {
  return useQuery({
    queryKey: ["GetSelection"],
    queryFn: () => {
      const url = "/properties/selection-list";
      {
        return axiosInstance
          .get<PropertiesResponse>(url)
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
export default useGetSelection;
