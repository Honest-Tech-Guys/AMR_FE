import { Room } from "./RoomType";
import { TenantType } from "./TenantType";
import { Unit } from "./UnitType";
type Creator = {
  id: number;
  name: string;
  avatar_url: string | null;
};
export type Book = {
  id: number;
  tenant_id: number;
  created_by: number;
  bookable_type: string;
  bookable_id: number;
  move_in_date: string;
  move_out_date: string;
  status: string;
  rental_fee: string;
  rental_payment_frequency: string;
  identity_type: string;
  identity_front_image: string | null;
  identity_back_image: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  tenant: TenantType;
  creator: Creator;
  bookable: Unit | Room;
};
