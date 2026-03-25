export interface Log {
  id: number;
  user_id?: string;
  user_name?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  description: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  created_at: string;
  user?: {
    name: string;
    avatar_url: string | null;
    position: {
      name: string;
      department: {
        name: string;
      } | null;
    } | null;
  };
}
