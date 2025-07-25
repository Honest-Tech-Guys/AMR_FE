export type PropertyType = {
  id: number;
  property_name: string;
  attention_name: string | null;
  attention_phone_number: string | null;
  property_type: string;
  remarks: string;
  address_line_1: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  facilities: string[];
  created_by: number;
  created_at: string;
  updated_at: string;
};
