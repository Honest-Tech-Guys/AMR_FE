export type OwnerProfile = {
  id: number;
  user_id: number;
  type: string; // e.g., "Individual" or "Company"
  alt_phone_number: string;
  nationality: string;
  nric_number: string;
  race: string;
  gender: string;
  address_line_1: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  emergency_contact_email: string;
  remarks: string;
  created_at: string;
  updated_at: string;
};

type OwnerType = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  email_verified_at: string | null;
  balance: string;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  owner_profile: OwnerProfile;
};
export default OwnerType;
