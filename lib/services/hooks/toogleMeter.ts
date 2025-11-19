import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { toast } from "sonner";
import ErrorToastHandel from "@/components/ErrorToastHandel";

type ToggleDeviceResponse = {
  success: boolean;
  status: string; // "on" | "off"
  [key: string]: any;
};

const useToggleDevice = () => {
  return useMutation({
    mutationFn: async (deviceId: number) => {
      const res = await axiosInstance.post<ToggleDeviceResponse>(
        `/tuya/devices/${deviceId}/toggle`
      );
      return res.data;
    },

    onSuccess: (data) => {
      const newState = data?.status === "on" ? "Connected" : "Disconnected";
      toast.success(`Device ${newState} successfully!`);
    },

    onError: (err: any) => {
      ErrorToastHandel(err);
    },
  });
};

export default useToggleDevice;
