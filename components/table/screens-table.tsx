'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { ScreenForm } from '@/components/form/screen-form';
import {
  createTextColumn,
  createDateColumn,
} from '@/components/ui/data-table/column-helpers';
import { Screen } from '@/types/screen';

const columns = [
  createTextColumn<Screen>('name', 'Nome da Tela'),
  createTextColumn<Screen>('name_key', 'Chave'),
  createDateColumn<Screen>(
    'updated_at',
    'Atualizado em',
    "dd/MM/yyyy 'às' HH:mm"
  ),
];

interface ScreensTableProps {
  data: Screen[];
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

export function ScreensTable({ data, permissions }: ScreensTableProps) {
  return (
    <DataTable<Screen, unknown>
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Buscar por tela..."
      permissions={{
        ...permissions,
        canCreate: false, // Forçar falso conforme pedido
        canDelete: false, // Forçar falso conforme pedido
      }}
      EditForm={ScreenForm}
    />
  );
}
