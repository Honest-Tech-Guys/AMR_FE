"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useGetUser from "@/lib/services/hooks/useGetUser";
interface Props {
  paymentData: {
    status: string;
    message: string;
    order_id: string;
  };
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

const ResultTopUp = ({ paymentData, isOpen, setIsOpen }: Props) => {
  const isSuccess = paymentData?.status === "success";
  const router = useRouter();
  const { refetch } = useGetUser();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-[460px] bg-white md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </DialogTitle>
        </DialogHeader>

        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="flex justify-center my-6"
        >
          {isSuccess ? (
            <CheckCircle2 className="text-green-500 w-20 h-20" />
          ) : (
            <XCircle className="text-red-500 w-20 h-20" />
          )}
        </motion.div>

        {/* Message */}
        <p className="text-gray-600 text-sm md:text-base mb-4">
          {paymentData?.message ||
            (isSuccess
              ? "Your payment has been processed successfully."
              : "Something went wrong with your payment.")}
        </p>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg py-3 px-4 text-left space-y-1 border">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> Transaction Details
          </p>
          <div className="text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-700">Order ID:</span>{" "}
              {paymentData?.order_id || "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              <span
                className={
                  isSuccess
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {paymentData?.status || "unknown"}
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-center">
          <Button
            className="text-white px-6"
            onClick={() => {
              router.replace("/");
              if (isSuccess) {
                refetch();
              }
              setIsOpen(false);
            }}
            variant={isSuccess ? "default" : "destructive"}
          >
            {isSuccess ? "Done" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultTopUp;
