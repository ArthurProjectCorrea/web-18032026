import { fetchApi } from '@/lib/api';
import { getCookiePermissions } from '@/lib/server-permissions';
import { SCREENS } from '@/configs/permissions';
import { getScreenName } from '@/lib/actions/screen-actions';
import { UserData } from '@/types/user';
import { UsersTable } from '@/components/table/users-table';
import { PageHeader } from '@/components/page-header';

export default async function UserPage() {
  const data: UserData[] = await fetchApi('/api/users', { cache: 'no-store' });
  const screenName = await getScreenName(SCREENS.USERS);
  const userPermissions = await getCookiePermissions(SCREENS.USERS);

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title={screenName}
        description="Gerencie os usuários da organização e seus cargos correspondentes."
      />

      <div className="flex-1">
        <UsersTable data={data} permissions={userPermissions} />
      </div>
    </div>
  );
}
