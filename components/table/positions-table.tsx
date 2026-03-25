'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { deletePosition } from '@/lib/actions/position-actions';
import { createTextColumn } from '@/components/ui/data-table/column-helpers';

export type PositionRow = {
  id: number;
  name: string;
  department_id: number;
  department?: { name: string };
};

const columns = [
  createTextColumn<PositionRow>('name', 'Cargo'),
  createTextColumn<PositionRow>('department.name', 'Departamento'),
];

interface PositionsTableProps {
  data: PositionRow[];
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

export function PositionsTable({ data, permissions }: PositionsTableProps) {
  const handleDelete = async (position: PositionRow) => {
    await deletePosition(position.id);
  };

  return (
    <DataTable<PositionRow, unknown>
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Filtrar por cargo..."
      permissions={permissions}
      onDelete={handleDelete}
      createLink="/admin/positions/create"
      editLink={(row: PositionRow) => `/admin/positions/${row.id}`}
    />
  );
}
