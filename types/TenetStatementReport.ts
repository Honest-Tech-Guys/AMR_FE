export type TenantStatementReport = {
  id: number;
  name: string;
  email: string;
  phone: string;
  invoices_count: number;
  total_amount: string;
  total_paid: string;
  total_overdue: string;
  balance: string;
};
