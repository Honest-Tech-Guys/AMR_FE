type NotificationType = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    message: string;
    tenancy_code: string;
    tenant_name: string;
    url: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
};
