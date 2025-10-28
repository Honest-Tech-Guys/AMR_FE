import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

interface TopUp {
  message: string;
  payment_url: string;
}

const useTopUp = () => {
  return useMutation({
    mutationKey: ["useTopUp"],
    mutationFn: async (amount: number) => {
      const res = await axiosInstance.post<TopUp>("/credits/topup", {
        amount,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.payment_url) {
        // ✅ Open in a new tab
        window.open(data.payment_url, "_blank");
      }
    },
    onError: (error) => {
      console.error("Top-up error:", error);
    },
  });
};

export default useTopUp;
