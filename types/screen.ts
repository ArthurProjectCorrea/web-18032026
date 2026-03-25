export interface Screen {
  id: number;
  name: string;
  name_key: string;
  path_pattern?: string | null;
  breadcrumb?: string | null;
  is_sub_screen?: boolean;
}
