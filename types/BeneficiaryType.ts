interface BeneficiaryType {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  email_verified_at: string | null;
  balance: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  avatar_url: string | null;
  beneficiary_profile: {
    id: number;
    user_id: number;
    type: "Individual" | "Organization" | string; // in case more types appear later
    alt_phone_number: string | null;
    nationality: string | null;
    nric_number: string | null;
    race: string | null;
    gender: string | null;
    address_line_1: string | null;
    city: string | null;
    postcode: string | null;
    state: string | null;
    country: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_email: string | null;
    bank_name: string | null;
    bank_account_number: string | null;
    bank_account_name: string | null;
    remarks: string | null;
    created_at: string;
    updated_at: string;
  };
}

export default BeneficiaryType;
