"use client";

import React, { useEffect, useState } from "react";
import { LoaderCircle, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import useResendVerificationEmail from "@/lib/services/hooks/useResendVerificationEmail";
export default function AccountVerificationRequiredPage() {
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuthStore();
  const { mutate, isPending } = useResendVerificationEmail();
  const searchParams = useSearchParams();
  useEffect(() => {
    setMounted(true);
  }, []);

  const card = (
    <div className="flex flex-col items-center gap-4 bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
      <ShieldAlert className="w-16 h-16 text-yellow-500" />
      <h1 className="text-2xl font-bold text-gray-800">
        Account Verification Required
      </h1>
      <p className="text-gray-600 text-center">
        Your registration is pending verification. To proceed, please check your
        email for a message containing a verification link. Kindly check your
        spam or junk folder if it does not appear in your primary inbox
      </p>

      <div className="mt-4 w-full grid grid-cols-2 gap-3">
        <Button
          className="w-full border   text-white"
          onClick={() => mutate()}
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="size-3 animate-spin " />
          ) : (
            "Resend Link"
          )}
        </Button>
        <Link href="/help">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Contact Support
          </Button>
        </Link>
      </div>

      <div className="mt-4 w-full">
        <Button variant="ghost" className="w-full" onClick={logout}>
          Back to Login
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      {mounted ? (
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full flex justify-center"
        >
          {card}
        </motion.div>
      ) : (
        <div className="w-full flex justify-center">{card}</div>
      )}
    </div>
  );
}
