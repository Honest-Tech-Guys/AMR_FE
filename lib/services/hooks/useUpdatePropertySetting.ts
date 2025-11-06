import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import PropertySettingType from "@/types/PropertySetting";

// The input type for updating property settings
export type UpdatePropertySettingInput = Partial<
  Omit<
    PropertySettingType,
    | "id"
    | "settingable_type"
    | "settingable_id"
    | "created_at"
    | "updated_at"
  >
> & {
  id: number; // id is required for updates
};

const useUpdatePropertySetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdatePropertySetting"],
    mutationFn: async (updatedSetting: UpdatePropertySettingInput) => {
      const { id, ...updateData } = updatedSetting;
      const res = await axiosInstance.put<PropertySettingType>(
        `/property-settings/${id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch units list to get updated settings
      queryClient.invalidateQueries({ queryKey: ["GetUnitsList"] });
      queryClient.invalidateQueries({ queryKey: ["GetUnit"] });
    },
    onError: (error) => {
      console.error("Update property setting error:", error);
    },
  });
};

export default useUpdatePropertySetting;

