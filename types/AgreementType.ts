import { FileData } from "./FileData";

export interface AgreementType {
  id: number;
  tenancy_id: number;
  agreement_date: string; // ISO date e.g. "2025-09-28"
  landlord_name: string;
  landlord_phone: string | null;
  landlord_email: string | null;
  landlord_identity_number: string | null;
  landlord_address: string | null;
  tenant_name: string;
  tenant_phone: string | null;
  tenant_email: string | null;
  tenant_identity_number: string | null;
  tenant_address: string | null;
  start_date: string; // ISO date
  end_date: string; // ISO date
  rental_amount: string; // e.g. "850.00"
  payment_due_day: string; // e.g. "7" (could be number if parsed)
  payment_bank_name: string | null;
  payment_bank_holder_name: string | null;
  payment_bank_account_number: string | null;
  security_deposit: string; // e.g. "0.00"
  key_deposit: string; // e.g. "0.00"
  advanced_rental_amount: string; // e.g. "0.00"
  house_rules_remarks: string | null;
  terms_conditions_remarks: string | null;
  attachments: FileData[]; // file paths
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}
