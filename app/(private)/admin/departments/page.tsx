import { fetchApi } from '@/lib/api';
import { getCookiePermissions } from '@/lib/server-permissions';
import { SCREENS } from '@/configs/permissions';
import { getScreenName } from '@/lib/actions/screen-actions';
import { DepartmentsTable } from '@/components/table/departments-table';
import { PageHeader } from '@/components/page-header';

export default async function DepartmentsPage() {
  const departmentsData = await fetchApi('/api/departments', {
    cache: 'no-store',
  });
  const screenName = await getScreenName(SCREENS.DEPARTMENTS);
  const permissionsData = await getCookiePermissions(SCREENS.DEPARTMENTS);

  console.log('DEBUG DepartmentsPage - data:', departmentsData);
  console.log('DEBUG DepartmentsPage - screenName:', screenName);
  console.log('DEBUG DepartmentsPage - permissions:', permissionsData);

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title={screenName}
        description="Gerencie os departamentos da organização."
      />
      <div className="flex-1">
        <DepartmentsTable
          data={departmentsData}
          permissions={permissionsData}
        />
      </div>
    </div>
  );
}
