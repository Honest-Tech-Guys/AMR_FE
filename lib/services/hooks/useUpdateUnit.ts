import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { UnitType } from "@/types/UnitType";

// The input type for updating units - includes id and omits auto-generated fields
export type UpdateUnitInput = Partial<
  Omit<UnitType, "id" | "created_at" | "updated_at" | "property">
> & {
  id: number; // id is required for updates
};

const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdateUnit"],
    mutationFn: async (updatedUnit: UpdateUnitInput) => {
      const { id, ...updateData } = updatedUnit;
      const res = await axiosInstance.put<UnitType>(
        `/update-unit/${id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: (updatedUnit) => {
      // Invalidate and refetch units list
      queryClient.invalidateQueries({ queryKey: ["GetUnitsList"] });

      // Optionally update the cache directly for better UX
      queryClient.setQueryData(
        ["GetUnitsList"],
        (oldData: UnitType[] | undefined) => {
          if (!oldData) return [updatedUnit];
          return oldData.map((unit) =>
            unit.id === updatedUnit.id ? updatedUnit : unit
          );
        }
      );
    },
    onError: (error) => {
      // Optionally handle error globally
      console.error("Update unit error:", error);
    },
  });
};

export default useUpdateUnit;
