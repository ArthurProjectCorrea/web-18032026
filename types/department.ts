export interface DepartmentData {
  id: number;
  name: string;
}

export interface DepartmentFormProps {
  data?: DepartmentData;
  close: () => void;
}

export interface CreateDepartmentData {
  name: string;
}

export interface UpdateDepartmentData {
  name: string;
}
