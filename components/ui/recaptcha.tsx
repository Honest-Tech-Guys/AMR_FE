"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";

interface RecaptchaProps {
  onChange: (verified: boolean, token?: string) => void;
  error?: string;
}

const Recaptcha: React.FC<RecaptchaProps> = ({ onChange, error }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleVerification = async () => {
    setIsChecking(true);

    // Simulate verification process
    setTimeout(() => {
      const token = `recaptcha_token_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setIsVerified(true);
      setIsChecking(false);
      onChange(true, token);
    }, 1500);
  };

  const handleReset = () => {
    setIsVerified(false);
    onChange(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="recaptcha"
          checked={isVerified}
          onCheckedChange={(checked) => {
            if (checked) {
              handleVerification();
            } else {
              handleReset();
            }
          }}
          disabled={isChecking}
        />
        <label
          htmlFor="recaptcha"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
        >
          <span>I am not a robot</span>
          {isVerified && <Check className="h-4 w-4 text-green-600" />}
        </label>
      </div>

      {isChecking && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Shield className="h-4 w-4 animate-pulse" />
          <span>Verifying...</span>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Shield className="h-4 w-4" />
            <span>Verification completed</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-green-600 hover:text-green-700"
          >
            Reset
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Recaptcha;
