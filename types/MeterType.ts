type Meter = {
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
  meterable: {
    id: number;
    property_name: string;
    property_type: string;
    status: string;
    owner_id: number;
    created_by: number;
    contact_name: string;
    contact_phone: string;
    remarks: string;
    address_line_1: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    facilities: string[];
    created_at: string;
    updated_at: string;
  };
};
