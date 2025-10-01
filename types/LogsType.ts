export type ActivityLog = {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  event: string;
  subject_id: number;
  causer_type: string;
  causer_id: number;
  properties: any[]; // can refine if you know structure
  batch_uuid: string | null;
  created_at: string;
  updated_at: string;
  causer: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
};
