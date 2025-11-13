import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { Room } from "@/types/RoomType";

// The input type for updating rooms - includes id and omits auto-generated fields
export type UpdateRoomInput = Partial<
  Omit<Room, "id" | "created_at" | "updated_at" | "unit" | "locks" | "meters">
> & {
  id: number; // id is required for updates
};

const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdateRoom"],
    mutationFn: async (updatedRoom: UpdateRoomInput) => {
      const { id, unit_id, ...updateData } = updatedRoom;
      const res = await axiosInstance.put<Room>(
        `/units/${unit_id}/rooms/${id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: (updatedRoom) => {
      // Invalidate and refetch units list to get updated rooms
      queryClient.invalidateQueries({ queryKey: ["GetUnitsList"] });
      queryClient.invalidateQueries({ queryKey: ["GetUnit"] });
    },
  });
};

export default useUpdateRoom;
