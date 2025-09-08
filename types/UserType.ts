// If permissions are just strings.
// If later they're objects, you can expand this.

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: string[];
}
