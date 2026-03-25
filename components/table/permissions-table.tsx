'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { PermissionForm } from '@/components/form/permission-form';
import {
  createTextColumn,
  createDateColumn,
} from '@/components/ui/data-table/column-helpers';
import { Permission } from '@/types/permission';

const columns = [
  createTextColumn<Permission>('name', 'Nome da Permissão'),
  createTextColumn<Permission>('name_key', 'Chave'),
  createDateColumn<Permission>(
    'updated_at',
    'Atualizado em',
    "dd/MM/yyyy 'às' HH:mm"
  ),
];

interface PermissionsTableProps {
  data: Permission[];
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

export function PermissionsTable({ data, permissions }: PermissionsTableProps) {
  return (
    <DataTable<Permission, unknown>
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Buscar por permissão..."
      permissions={{
        ...permissions,
        canCreate: false, // Forçar falso conforme pedido
        canDelete: false, // Forçar falso conforme pedido
      }}
      EditForm={PermissionForm}
    />
  );
}
