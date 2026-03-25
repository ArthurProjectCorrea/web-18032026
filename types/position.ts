export interface AccessItem {
  screen_id: number;
  permission_id: number;
  screen_name: string;
  permission_name: string;
  scope: 'all' | 'department' | 'own' | null;
}

export interface PositionData {
  id: number;
  name: string;
  department_id: number;
}

export interface PositionFormProps {
  data?: PositionData;
  close?: () => void;
}

export interface PositionAccess {
  screen_id: number;
  permission_id: number;
  scope: 'all' | 'department' | 'own' | null;
}

export interface CreatePositionData {
  name: string;
  department_id: number;
  accesses: PositionAccess[];
}

export interface UpdatePositionData {
  name: string;
  department_id: number;
  accesses: PositionAccess[];
}
