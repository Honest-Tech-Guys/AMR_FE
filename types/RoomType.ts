type Room = {
  id: number;
  name: string;
  unit_id: number;
  unit: Unit;
  status: "Vacant" | "Occupied";
  locks: Locks[];
  meters: Meter[];
  description: string;
  remarks: string;
  created_at: string;
  updated_at: string;
};
