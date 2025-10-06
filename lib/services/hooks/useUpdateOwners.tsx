import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";
import OwnerType from "@/types/OwnerType";

// The input type for updating tenants - includes id and omits auto-generated fields
export type UpdateOwner = Partial<
  Omit<OwnerType, "id" | "created_at" | "updated_at">
> & {
  id: number; // id is required for updates
};

const useUpdateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdateOwner"],
    mutationFn: async (updatedOwner: UpdateOwner) => {
      const { id, ...updateData } = updatedOwner;
      const res = await axiosInstance.put<OwnerType>(
        `/owners/${id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: (updatedOwner) => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: ["GetOwnersList"] });

      // Optionally update the cache directly for better UX
      queryClient.setQueryData(
        ["GetOwnersList"],
        (oldData: OwnerType[] | undefined) => {
          if (!oldData) return [updatedOwner];
          return oldData.map((owner) =>
            owner.id === updatedOwner.id ? updatedOwner : owner
          );
        }
      );
    },
    onError: (error) => {
      // Optionally handle error globally
      console.error("Update owner error:", error);
    },
  });
};

export default useUpdateOwner;
