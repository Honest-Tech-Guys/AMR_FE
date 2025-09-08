import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

// ✅ Update input type: everything except immutable fields
export type UpdateMeterInput = Partial<
  Omit<
    Meter,
    | "created_at"
    | "updated_at"
    | "created_by"
    | "meterable_type"
    | "meterable_id"
  >
> & { id: number }; // require id for update

const useUpdateMeter = () => {
  return useMutation({
    mutationKey: ["UpdateMeter"],
    mutationFn: async (updatedMeter: UpdateMeterInput) => {
      const { id, ...payload } = updatedMeter;
      const res = await axiosInstance.put<Meter>(`/meters/${id}`, payload);
      return res.data;
    },
    onError: (error) => {
      console.error("Update meter error:", error);
    },
  });
};

export default useUpdateMeter;
