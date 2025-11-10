import EquipmentType from "./EquipmentType";
import PropertySettingType from "./PropertySetting";
import { Tenancy } from "./TenancyType";
import { Unit } from "./UnitType";

export type Room = {
  id: number;
  name: string;
  unit_id: number;
  unit: Unit;
  status: "Vacant" | "Occupied";
  locks: Locks[];
  coordinates: { x: string; y: string } | null;
  meters: Meter[];
  description: string;
  equipment?: EquipmentType[];
  setting?: PropertySettingType;
  last_active_tenancy: Tenancy[];
  remarks: string;
  created_at: string;
  updated_at: string;
};
