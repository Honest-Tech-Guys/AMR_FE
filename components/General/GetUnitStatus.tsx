import { Room } from "@/types/RoomType";

export function getUnitStatus(item: Room[] | Carpark[]) {
  if (item.length === 0) {
    return "No Rooms";
  }

  const occupied = item.filter((r) => r.status === "Occupied").length;
  const vacant = item.filter((r) => r.status === "Vacant").length;
  // const maintenance = unit.rooms.every(
  //   (r) => r.status === "maintenance"
  // );
  // const reserved = unit.rooms.every(
  //   (r) => r.status === "reserved"
  // );

  // if (maintenance) return "Maintenance";
  // if (reserved) return "Reserved";
  if (occupied === item.length) return "Fully Occupied";
  if (occupied > 0 && vacant > 0) return "Partially Occupied";
  if (occupied === 0 && vacant === item.length) return "Vacant";

  return "Partially Occupied";
}
export const unitStatusConfig: Record<
  | "Fully Occupied"
  | "Partially Occupied"
  | "Vacant"
  | "No Rooms"
  | "Maintenance"
  | "Reserved",
  { label: string; badgeClass: string }
> = {
  "Fully Occupied": {
    label: "Fully Occupied",
    badgeClass: "bg-green-600 text-white",
  },
  "Partially Occupied": {
    label: "Partially Occupied",
    badgeClass: "bg-blue-500 text-white",
  },
  Vacant: {
    label: "Vacant",
    badgeClass: "bg-red-500 text-white",
  },
  "No Rooms": {
    label: "No Rooms",
    badgeClass: "bg-gray-400 text-white",
  },
  Maintenance: {
    label: "Maintenance",
    badgeClass: "bg-blue-500 text-white",
  },
  Reserved: {
    label: "Reserved",
    badgeClass: "bg-purple-500 text-white",
  },
};
