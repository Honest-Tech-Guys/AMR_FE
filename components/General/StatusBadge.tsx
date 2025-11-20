import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    {
      variant: "default" | "secondary" | "outline" | "destructive";
      className: string;
    }
  > = {
    "Fully Occupied": {
      variant: "default",
      className: "bg-red-500 hover:bg-red-500 text-white",
    },
    "Partially Occupied": {
      variant: "secondary",
      className: "bg-blue-500 hover:bg-blue-500 text-white border-blue-500",
    },
    Vacant: {
      variant: "outline",
      className: "bg-green-500 hover:bg-green-500 text-white",
    },
    Deactivated: {
      variant: "destructive",
      className: "bg-gray-500 hover:bg-gray-500 text-black",
    },
  };

  const config = statusConfig[status] || {
    variant: "secondary" as const,
    className: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
};
