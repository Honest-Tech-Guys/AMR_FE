import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import ErrorToastHandel from "@/components/ErrorToastHandel";
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
    onError: (err: any) => {
      ErrorToastHandel(err);
    },
  });
};
export default useMarkAllNotifications;
