import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import PropertySettingType from "@/types/PropertySetting";

// The input type for updating property settings
export type UpdatePropertySettingInput = Partial<
  Omit<
    PropertySettingType,
    "id" | "settingable_type" | "settingable_id" | "created_at" | "updated_at"
  >
> & {
  room_id?: number;
  unit_id?: number;
};

const useUpdatePropertySetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdatePropertySetting"],
    mutationFn: async (updatedSetting: UpdatePropertySettingInput) => {
      const res = await axiosInstance.post<PropertySettingType>(
        `/property-settings`,
        updatedSetting
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch units list to get updated settings
      queryClient.invalidateQueries({ queryKey: ["GetUnitsList"] });
      queryClient.invalidateQueries({ queryKey: ["GetUnit"] });
    },
  });
};

export default useUpdatePropertySetting;
