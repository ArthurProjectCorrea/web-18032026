'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { DepartmentForm } from '@/components/form/department-form';
import { deleteDepartment } from '@/lib/actions/department-actions';
import {
  createTextColumn,
  createDateColumn,
} from '@/components/ui/data-table/column-helpers';

export type DepartmentRow = {
  id: number;
  name: string;
  created_at: string;
};

const columns = [
  createTextColumn<DepartmentRow>('name', 'Departamento'),
  createDateColumn<DepartmentRow>(
    'created_at',
    'Criado em',
    "dd/MM/yyyy 'às' HH:mm"
  ),
];

interface DepartmentsTableProps {
  data: DepartmentRow[];
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

export function DepartmentsTable({ data, permissions }: DepartmentsTableProps) {
  const handleDelete = async (department: DepartmentRow) => {
    await deleteDepartment(department.id);
  };

  return (
    <DataTable<DepartmentRow, unknown>
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Buscar por departamento..."
      permissions={permissions}
      onDelete={handleDelete}
      EditForm={DepartmentForm}
      CreateForm={DepartmentForm}
    />
  );
}
