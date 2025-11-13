import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { Unit } from "@/types/UnitType";

// The input type for updating units - includes id and omits auto-generated fields
interface AddTagProps {
  room_id: number;
  x: number;
  y: number;
}
const useAddTagRoom = (unit_id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["AddTagRoom"],
    mutationFn: async (updatedUnit: AddTagProps[]) => {
      const res = await axiosInstance.put<Unit>(`/units/${unit_id}/tag`, {
        tags: updatedUnit,
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch units list
      queryClient.invalidateQueries({ queryKey: ["GetPropertyList"] });

      // Optionally update the cache directly for better UX
    },
  });
};

export default useAddTagRoom;
