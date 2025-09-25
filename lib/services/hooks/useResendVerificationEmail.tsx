import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../ApiCore";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";
const useResendVerificationEmail = () => {
  return useMutation({
    mutationKey: ["useResendVerificationEmail"],
    mutationFn: () => {
      return axiosInstance
        .post("/resend-verification-email")
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
    onSuccess: () => {
      toast.success("Resend Verification Email Successfully", {
        icon: <ShieldCheck className="text-green-700" />,
      });
    },
    onError: (error) => {
      console.error("Resend Verification Email", error);
      toast.error("Failed to Resend Verification Email", {
        icon: <ShieldAlert className="text-red-500" />,
      });
    },
  });
};
export default useResendVerificationEmail;
