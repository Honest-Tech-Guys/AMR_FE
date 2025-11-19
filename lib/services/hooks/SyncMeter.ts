import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";

type DeviceStatusResponse = {
  status: string;
  power: string;
  [key: string]: any; // إذا في بيانات إضافية
};

const useGetDeviceStatus = (deviceId?: number) => {
  return useQuery({
    queryKey: ["GetDeviceStatus", deviceId],
    queryFn: () => {
      const url = `/tuya/devices/${deviceId}/status`;
      return axiosInstance
        .get<DeviceStatusResponse>(url)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error("Error fetching device status:", error);
          throw error;
        });
    },
    enabled: !!deviceId,
  });
};

export default useGetDeviceStatus;
