'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import {
  createTextColumn,
  createDateColumn,
  createBadgeColumn,
} from '@/components/ui/data-table/column-helpers';
import { ColumnDef } from '@tanstack/react-table';
import { UserAvatarCard } from '@/components/button/user-avatar-card';
import { Log } from '@/types/log';

const columns: ColumnDef<Log>[] = [
  createDateColumn<Log>('created_at', 'Data/Hora', 'dd/MM/yyyy HH:mm:ss'),
  {
    accessorKey: 'user',
    header: 'Usuário',
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return row.original.user_name || '---';
      return (
        <UserAvatarCard user={user} showName className="hover:opacity-100" />
      );
    },
  },
  createBadgeColumn<Log>('action', 'Ação', {
    variant: (value) => {
      switch (value) {
        case 'CREATE':
          return 'default';
        case 'UPDATE':
          return 'secondary';
        case 'DELETE':
          return 'destructive';
        default:
          return 'outline';
      }
    },
  }),
  createTextColumn<Log>('table_name', 'Tabela'),
  createTextColumn<Log>('description', 'Descrição'),
];

interface LogsTableProps {
  data: Log[];
  permissions?: {
    canView?: boolean;
  };
}

export function LogsTable({ data }: LogsTableProps) {
  return (
    <DataTable<Log, unknown>
      columns={columns}
      data={data}
      filterColumn="description"
      filterPlaceholder="Buscar nos logs..."
      permissions={{
        canCreate: false,
        canEdit: false,
        canDelete: false,
      }}
    />
  );
}
