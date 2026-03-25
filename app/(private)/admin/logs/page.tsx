export const dynamic = 'force-dynamic';

import { getAuditLogs } from '@/lib/actions/log-actions';
import { LogsTable } from '@/components/table/logs-table';
import { getCookiePermissions } from '@/lib/server-permissions';

export default async function AdminLogsPage() {
  const logs = await getAuditLogs();
  const permissions = await getCookiePermissions('audit_logs');

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
        <p className="text-muted-foreground">
          Histórico completo de ações e alterações realizadas no sistema.
        </p>
      </div>

      <div className="flex-1">
        <LogsTable
          data={Array.isArray(logs) ? logs : []}
          permissions={permissions}
        />
      </div>
    </div>
  );
}
