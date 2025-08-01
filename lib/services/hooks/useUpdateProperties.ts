import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { PropertyType } from "@/types/PropertyType";

// The input type for updating properties - includes id and omits auto-generated fields
export type UpdatePropertyInput = Partial<
  Omit<PropertyType, "id" | "created_at" | "updated_at" | "created_by">
> & {
  id: number; // id is required for updates
};

const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdateProperty"],
    mutationFn: async (updatedProperty: UpdatePropertyInput) => {
      const { id, ...updateData } = updatedProperty;
      const res = await axiosInstance.put<PropertyType>(
        `/properties/${id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: (updatedProperty) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ["GetProperties"] });

      // Optionally update the cache directly for better UX
      queryClient.setQueryData(
        ["GetProperties"],
        (oldData: PropertyType[] | undefined) => {
          if (!oldData) return [updatedProperty];
          return oldData.map((property) =>
            property.id === updatedProperty.id ? updatedProperty : property
          );
        }
      );
    },
    onError: (error) => {
      // Optionally handle error globally
      console.error("Update property error:", error);
    },
  });
};

export default useUpdateProperty;
