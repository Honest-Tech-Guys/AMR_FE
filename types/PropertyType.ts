type OwnerOrCreator = {
  id: number;
  name: string;
};

type Property = {
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
  owner: OwnerOrCreator;
  creator: OwnerOrCreator;
  units: Unit[];
};
