type Tenancy = {
  id: number;
  tenant_id: number;
  tenantable_type: string; // e.g. "App\\Models\\Room"
  tenantable_id: number;
  date_of_agreement: string; // ISO date "2025-09-01"
  rental_fee: string; // formatted string "850.00"
  tenancy_period_start_date: string; // ISO date
  tenancy_period_end_date: string; // ISO date
  rental_payment_frequency: string; // e.g. "Monthly"
  remarks: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  created_by: number;
  code: string;
  tenantable: Unit | Room;

  tenant: {
    id: number;
    name: string;
  };

  creator: {
    id: number;
    name: string;
  };
};
