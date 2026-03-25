export const dynamic = 'force-dynamic';

import { SeeuServiceTable } from '@/components/table/seeu-service-table';
import { fetchApi } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import { getCookiePermissions } from '@/lib/server-permissions';
import { SCREENS } from '@/configs/permissions';
import { getScreenName } from '@/lib/actions/screen-actions';

export default async function SeeuServicePage() {
  const seeuServiceData = await fetchApi('/api/admin/seeu-service', {
    cache: 'no-store',
  });
  const screenName = await getScreenName(SCREENS.SEEU_SERVICE);
  const permissionsData = await getCookiePermissions(SCREENS.SEEU_SERVICE);

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title={screenName}
        description="Gerencie os atendimentos, termos de comparecimento e vínculos empregatícios."
      />

      <div className="flex-1">
        <SeeuServiceTable
          data={seeuServiceData}
          permissions={permissionsData}
        />
      </div>
    </div>
  );
}
