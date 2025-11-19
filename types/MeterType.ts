import { Room } from "./RoomType";
import { Unit } from "./UnitType";

type MeterType = {
  id: number;
  meterable_type: string;
  meterable_id: number;
  name: string;
  serial_number: string;
  brand: string;
  model: string;
  used_unit: string;
  balance_unit: string;
  connection_status: "online" | "offline"; // حسب القيم
  power_status: "on" | "off"; // حسب القيم
  unit_price_per_unit: string;
  minimum_topup_unit: number;
  minimum_topup_rm: string;
  free_unit: number;
  free_unit_refresh_on: string | null;
  remarks: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  meterable: Unit | Room;
};
export default MeterType;
