import EquipmentType from "./EquipmentType";
import LockType from "./LockType";
import MeterType from "./MeterType";
import PropertySettingType from "./PropertySetting";
import { Tenancy } from "./TenancyType";
import { Unit } from "./UnitType";

export type Room = {
  id: number;
  name: string;
  unit_id: number;
  unit: Unit;
  status: "Vacant" | "Occupied";
  locks: LockType[];
  coordinates: { x: string; y: string } | null;
  meters: MeterType[];
  description: string;
  equipment?: EquipmentType[];
  setting?: PropertySettingType;
  last_active_tenancy: Tenancy[];
  remarks: string;
  created_at: string;
  updated_at: string;
};
