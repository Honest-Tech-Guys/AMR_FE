"use client";

import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon: LucideIcon;
  iconPosition?: "left" | "right";
  containerClassName?: string;
}

export const InputWithIcon = ({
  icon: Icon,
  iconPosition = "left",
  containerClassName,
  className,
  ...props
}: InputWithIconProps) => {
  const isLeft = iconPosition === "left";

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Icon
        className={cn(
          "absolute top-1/2 h-3 w-3 text-muted-foreground -translate-y-1/2",
          isLeft ? "left-3" : "right-3"
        )}
      />
      <Input {...props} className={cn(isLeft ? "pl-10" : "pr-10", className)} />
    </div>
  );
};
