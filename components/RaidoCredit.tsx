"use client";

import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { ArrowUpToLine, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type TopUpOption = {
  value: string;
  label: string;
  description?: string;
};

type TopUpRadioProps = {
  options: TopUpOption[];
  value: string;
  setValue: (val: string) => void;
  className?: string;
};

const TopUpRadio: React.FC<TopUpRadioProps> = ({
  options,
  value,
  setValue,
  className,
}) => {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={setValue}
      className={cn("max-w-md w-full grid grid-cols-3 gap-4", className)}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(
            "relative group ring-[1px] ring-border rounded-lg py-2 px-3 text-start cursor-pointer transition-all duration-150",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:bg-primary/5"
          )}
        >
          <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-primary fill-primary stroke-white group-data-[state=unchecked]:hidden" />
          <ArrowUpToLine className="mb-2.5 text-muted-foreground" />
          <span className="font-semibold tracking-tight block">
            {option.label}
          </span>
          {option.description && (
            <p className="text-xs text-muted-foreground">
              {option.description} <sub>Credits</sub>
            </p>
          )}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

export default TopUpRadio;
