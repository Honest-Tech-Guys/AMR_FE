import { Tenancy } from "./TenancyType";

export type Invoice = {
  id: number;
  tenancy_id: number;
  invoice_number: string;
  issue_date: string; // ISO date string "2025-09-03"
  due_date: string; // ISO date string
  sub_total: string; // "2578752.00"
  total_tax: string; // "25787.52"
  total_amount: string; // "2604539.52"
  status: "Draft" | "Sent" | "Paid" | "Cancelled"; // extend as needed
  notes: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  tenancy: Tenancy;
  items: {
    id: number;
    invoice_id: number;
    item_name: string;
    quantity: string; // "21312.00"
    unit_price: string; // "121.00"
    tax_percentage: string; // "1.00"
    remarks: string | null;
    created_at: string;
    updated_at: string;
  }[];
};
