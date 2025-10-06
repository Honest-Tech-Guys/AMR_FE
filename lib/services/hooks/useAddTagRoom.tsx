import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { Unit } from "@/types/UnitType";

// The input type for updating units - includes id and omits auto-generated fields
interface AddTagProps {
  room_id: string;
  remark?: string;
  x: string;
  y: string;
}
const useAddTagRoom = (unit_id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["AddTagRoom"],
    mutationFn: async (updatedUnit: AddTagProps) => {
      const { room_id, ...updateData } = updatedUnit;
      const res = await axiosInstance.put<Unit>(
        `/units/${unit_id}/rooms/${room_id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch units list
      queryClient.invalidateQueries({ queryKey: ["GetPropertyList"] });

      // Optionally update the cache directly for better UX
    },
    onError: (error) => {
      // Optionally handle error globally
      console.error("Add Tag error:", error);
    },
  });
};

export default useAddTagRoom;
