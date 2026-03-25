import { fetchApi } from '@/lib/api';
import { getCookiePermissions } from '@/lib/server-permissions';
import { SCREENS } from '@/configs/permissions';
import { getScreenName } from '@/lib/actions/screen-actions';
import { PositionsTable } from '@/components/table/positions-table';
import { PageHeader } from '@/components/page-header';

export default async function PositionsPage() {
  const positionsData = await fetchApi('/api/positions', { cache: 'no-store' });
  const screenName = await getScreenName(SCREENS.POSITIONS);
  const permissionsData = await getCookiePermissions(SCREENS.POSITIONS);

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title={screenName}
        description="Gerencie os cargos e permissões de acesso da organização."
      />
      <div className="flex-1">
        <PositionsTable data={positionsData} permissions={permissionsData} />
      </div>
    </div>
  );
}
