import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

// Basic Invoice type - you can update this to match your actual Invoice structure

const useCreateExpenses = () => {
  return useMutation({
    mutationKey: ["useCreateExpenses"],
    mutationFn: async (newExpenses: object) => {
      // const { tenancy_id, ...data } = newExpenses;
      const res = await axiosInstance.post(
        `/tenancies/${12}/expenses`,
        newExpenses
      );
      return res.data;
    },
  });
};

export default useCreateExpenses;
