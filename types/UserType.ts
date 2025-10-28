// If permissions are just strings.
// If later they're objects, you can expand this.

import Role from "./RoleType";

export default interface User {
  id: number;
  name: string;
  email: string;
  balance: string;
  email_verified_at: string | null;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: string[];
  nationality?: string;
  nric_number?: string;
  race?: string;
  gender?: string;
  address_line_1?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
}
