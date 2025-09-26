"use client";

import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function Page() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    setMounted(true);
  }, []);

  const card = (
    <div className="flex flex-col items-center gap-4 bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
      <XCircle className="w-16 h-16 text-red-500" />
      <h1 className="text-2xl font-bold text-gray-800">Verification Failed</h1>
      <p className="text-gray-600 text-center">
        We couldn't verify your account. The verification link may have expired
        or something went wrong.
      </p>

      <div className="mt-4 w-full">
        <Link href="/">
          <Button variant="ghost" className="w-full">
            Back to Login
          </Button>
        </Link>
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
