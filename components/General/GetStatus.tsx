import { KeyRound } from "lucide-react";
import { Separator } from "../ui/separator";

const roomStatusConfig: Record<"Vacant" | "Occupied", { color: string }> = {
  Vacant: { color: "red-500" },
  Occupied: { color: "green-500" },
};

export const getStatus = (value: "Vacant" | "Occupied") => {
  if (!value) {
    return;
  }
  const { color } = roomStatusConfig[value];

  return (
    <div className="flex items-center justify-between">
      <div className={`bg-${color} p-2 rounded-sm`}>
        <KeyRound className="size-3 text-white" />
      </div>
      <span className={`text-${color}`}>{value}</span>
      <Separator className={`bg-${color} max-w-60`} />
    </div>
  );
};
