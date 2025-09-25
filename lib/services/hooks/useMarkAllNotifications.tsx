import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";
const useMarkAllNotifications = () => {
  return useMutation({
    mutationKey: ["useMarkAllNotifications"],
    mutationFn: () => {
      return axiosInstance
        .post("/notifications/mark-all-as-read")
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
    onSuccess: () => {
      toast.success("All Notification Read Successfully", {
        icon: <ShieldCheck className="text-green-700" />,
      });
    },
    onError: (error) => {
      console.error("All Notification Read", error);
      toast.error("Failed to All Notification Read", {
        icon: <ShieldAlert className="text-red-500" />,
      });
    },
  });
};
export default useMarkAllNotifications;
