import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { TenantType } from "@/types/TenantType";

// The input type for updating tenants - includes id and omits auto-generated fields
export type UpdateTenantInput = Partial<
  Omit<TenantType, "created_at" | "updated_at">
>;

const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdateTenant"],
    mutationFn: async (updatedTenant: UpdateTenantInput) => {
      const { id, ...updateData } = updatedTenant;
      const res = await axiosInstance.put<TenantType>(`/tenants/${id}`, {
        name: updateData.name,
        email: updateData.email,
        tenant_profile: updateData,
      });
      return res.data;
    },
    onSuccess: (updatedTenant) => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: ["GetTenantsList"] });

      // Optionally update the cache directly for better UX
      queryClient.setQueryData(
        ["GetTenantsList"],
        (oldData: TenantType[] | undefined) => {
          if (!oldData) return [updatedTenant];
          return oldData.map((tenant) =>
            tenant.id === updatedTenant.id ? updatedTenant : tenant
          );
        }
      );
    },
  });
};

export default useUpdateTenant;
