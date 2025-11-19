import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { toast } from "sonner";
import ErrorToastHandel from "@/components/ErrorToastHandel";

type TopUpResponse = {
  success: boolean;
  balance: number;
  [key: string]: any;
};

const useTopUpDevice = () => {
  return useMutation({
    mutationFn: async (data: { deviceId: number; unit: number }) => {
      const res = await axiosInstance.post<TopUpResponse>(
        `/tuya/devices/${data.deviceId}/top-up`,
        { unit: data.unit }
      );
      return res.data;
    },

    onSuccess: () => {
      toast.success("Top up completed successfully!");
    },

    onError: (err: any) => {
      ErrorToastHandel(err);
    },
  });
};

export default useTopUpDevice;
