import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import ErrorToastHandel from "@/components/ErrorToastHandel";
const useMarkNotification = () => {
  return useMutation({
    mutationKey: ["useMarkNotification"],
    mutationFn: (id: string) => {
      return axiosInstance
        .post(`/notifications/${id}/mark-as-read`)
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
    onSuccess: () => {
      toast.success(" Notification Read Successfully", {
        icon: <ShieldCheck className="text-green-700" />,
      });
    },
    onError: (err: any) => {
      ErrorToastHandel(err);
    },
  });
};
export default useMarkNotification;
