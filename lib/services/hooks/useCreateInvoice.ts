import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

// Basic Invoice type - you can update this to match your actual Invoice structure

const useCreateInvoice = () => {
  return useMutation({
    mutationKey: ["CreateInvoice"],
    mutationFn: async (newInvoice: object) => {
      const res = await axiosInstance.post("/invoices", newInvoice);
      return res.data;
    },
  });
};

export default useCreateInvoice;
