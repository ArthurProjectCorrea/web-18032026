'use client';

import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { UserForm } from '@/components/form/user-form';
import { deleteUser } from '@/lib/actions/user-actions';
import {
  createTextColumn,
  createBadgeColumn,
  createDateColumn,
  createCustomColumn,
} from '@/components/ui/data-table/column-helpers';
import { UserAvatarCard } from '@/components/button/user-avatar-card';
import { UserData } from '@/types/user';

interface UsersTableProps {
  data: UserData[];
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<UserData, any>[] = [
  createCustomColumn('avatar_url', 'Avatar', ({ row }) => (
    <UserAvatarCard
      user={{
        name: row.original.name,
        avatar_url: row.original.avatar_url ?? null,
        position: row.original.position
          ? {
              name: row.original.position.name,
              department: row.original.position.department
                ? { name: row.original.position.department.name }
                : null,
            }
          : null,
      }}
    />
  )),
  createTextColumn('name', 'Nome'),
  createBadgeColumn('position.department.name', 'Departamento', {
    fallback: 'Sem Departamento',
  }),
  createBadgeColumn('position.name', 'Cargo', {
    variant: 'outline',
    fallback: 'Sem Cargo',
  }),
  createDateColumn('created_at', 'Data de Criação'),
  createTextColumn('registration', 'Matrícula'),
];

export function UsersTable({ data, permissions }: UsersTableProps) {
  const handleDeleteUser = async (user: UserData) => {
    await deleteUser(user.id);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DataTable<UserData, any>
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Filtrar por nome..."
      onDelete={handleDeleteUser}
      EditForm={UserForm}
      CreateForm={UserForm}
      permissions={permissions}
      dialogClassName="sm:max-w-2xl"
    />
  );
}
