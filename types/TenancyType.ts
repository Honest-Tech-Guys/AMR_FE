import { AgreementType } from "./AgreementType";
import { Invoice } from "./InvoiceType";
import { Room } from "./RoomType";
import { Unit } from "./UnitType";

export type Tenancy = {
  id: number;
  code: string;
  status: string;
  tenant_id: number;
  tenantable_type: string;
  tenantable_id: number;
  date_of_agreement: string; // ISO date
  rental_fee: string;
  tenancy_period_start_date: string; // ISO date
  tenancy_period_end_date: string; // ISO date
  rental_payment_frequency: string;
  remarks: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  created_by: number;
  full_property_name: string;
  tenant: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
  creator: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
  agreement: AgreementType;
  invoices: Invoice[];
  documents: {
    id: number;
    tenancy_id: number;
    uploaded_by_user_id: number;
    name: string;
    file_path: string;
    file_name: string;
    file_size: number;
    type: string;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
    url: string;
  }[];
  tenantable: Unit | Room;
  meters: Meter[];
  locks: Locks[];
};
