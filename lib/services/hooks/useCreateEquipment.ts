import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

// Basic Invoice type - you can update this to match your actual Invoice structure

const useCreateEquipment = () => {
  return useMutation({
    mutationKey: ["CreateInvoice"],
    mutationFn: async (newEquipment: object) => {
      const res = await axiosInstance.post("/equipment", newEquipment);
      return res.data;
    },
    onError: (error) => {
      // Optionally handle error globally
      console.error("Create Equipment error:", error);
    },
  });
};

export default useCreateEquipment;
