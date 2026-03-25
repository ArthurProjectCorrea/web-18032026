export const dynamic = 'force-dynamic';

import { headers, cookies } from 'next/headers';
import { getCookiePermissions } from '@/lib/server-permissions';
import { ScreensTable } from '@/components/table/screens-table';
import { Screen } from '@/types/screen';

export default async function AdminScreensPage() {
  const host = (await headers()).get('host');
  const prot = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const response = await fetch(`${prot}://${host}/api/admin/screens`, {
    cache: 'no-store',
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  const screens: Screen[] = await response.json();
  const permissions = await getCookiePermissions('screens_manage');

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Telas
        </h1>
        <p className="text-muted-foreground">
          Configure os nomes das telas utilizadas no sistema de permissões.
        </p>
      </div>

      <div className="flex-1">
        <ScreensTable
          data={Array.isArray(screens) ? screens : []}
          permissions={{
            ...permissions,
            canCreate: false,
            canDelete: false,
          }}
        />
      </div>
    </div>
  );
}
