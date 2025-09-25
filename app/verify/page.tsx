"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * VerifySuccessPage
 *
 * Fix for runtime error caused by Framer Motion attempting to initialize
 * before the component is mounted in the browser. We guard the animated
 * markup behind a `mounted` flag (set inside useEffect) so Framer Motion's
 * runtime is only used when `window`/DOM is available. While mounted is
 * false we render the exact same static markup (no motion) to avoid any
 * hydration mismatch.
 */
export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure animations only run in the browser
    setMounted(true);
  }, []);

  const card = (
    <div className="flex flex-col items-center gap-4 bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
      <CheckCircle className="w-16 h-16 text-primary-foreground" />
      <h1 className="text-2xl font-bold text-gray-800">
        Verification Successful
      </h1>
      <p className="text-gray-600 text-center">
        Your account has been successfully verified. You can now continue to use
        all features.
      </p>

      <div className="mt-6 w-full">
        <Link href="/">
          <Button className="w-full  text-white">Go to Login</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {mounted ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          {card}
        </motion.div>
      ) : (
        // Render identical static markup on first render to avoid hydration
        <div className="w-full flex justify-center">{card}</div>
      )}
    </div>
  );
}

/*
  Suggested tests (copy into a new file like `VerifySuccessPage.test.tsx`)
  ---------------------------------------------------------------------
  These are example React Testing Library tests you can drop into your
  test suite. They are provided as comments so this file remains a valid
  Next.js page/component and won't break runtime.

  import { render, screen } from '@testing-library/react';
  import VerifySuccessPage from './VerifySuccessPage';

  test('renders heading and login button', () => {
    render(<VerifySuccessPage />);
    expect(screen.getByText(/Verification Successful/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Login/i })).toBeInTheDocument();
  });

  // If you want to assert the motion element appears after mount, you can
  // use `waitFor` to check for animations in an environment that supports
  // layout effects. Many CI environments don't run animations so keep this
  // optional.
*/
