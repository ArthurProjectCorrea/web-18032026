export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  registration?: string | null;
  created_at?: string;
  position?: {
    id: number;
    name: string;
    department?: {
      id: number;
      name: string;
    };
  } | null;
}

export interface UserProfileFormProps {
  data: UserData;
  close: () => void;
  className?: string;
}

export interface ProfileSettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    registration?: string | null;
    department?: string;
    position?: string;
  };
  onSuccess?: () => void;
  className?: string;
}

export interface UpdateUserData {
  name: string;
  registration?: string | null;
  position_id?: number | null;
}
