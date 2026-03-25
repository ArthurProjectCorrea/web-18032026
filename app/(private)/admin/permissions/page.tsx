export const dynamic = 'force-dynamic';

import { headers, cookies } from 'next/headers';
import { getCookiePermissions } from '@/lib/server-permissions';
import { PermissionsTable } from '@/components/table/permissions-table';
import { Permission } from '@/types/permission';

export default async function AdminPermissionsPage() {
  const host = (await headers()).get('host');
  const prot = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const response = await fetch(`${prot}://${host}/api/admin/permissions`, {
    cache: 'no-store',
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  const permissions: Permission[] = await response.json();
  const permissionsPerms = await getCookiePermissions('permissions_manage');

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Permissões
        </h1>
        <p className="text-muted-foreground">
          Configure os nomes das permissões utilizadas no sistema.
        </p>
      </div>

      <div className="flex-1">
        <PermissionsTable
          data={Array.isArray(permissions) ? permissions : []}
          permissions={{
            ...permissionsPerms,
            canCreate: false,
            canDelete: false,
          }}
        />
      </div>
    </div>
  );
}
