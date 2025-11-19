import { Room } from "./RoomType";
import { Unit } from "./UnitType";

type LockType = {
  id: number;
  lockable_type: string;
  lockable_id: number;
  lockable: Unit | Room;
  serial_number: string;
  tenant_name?: string;
  auto_create_passcode: number;
  self_check_options: string[];
  created_at: string;
  updated_at: string;
};
export default LockType;
