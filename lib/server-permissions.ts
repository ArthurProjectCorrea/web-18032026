import { cookies } from 'next/headers';
import { parseSession, hasPermission } from '@/lib/permissions';

/**
 * Função utilitária para obter permissões de um cookie no lado do servidor (Server Components).
 *
 * @param screenKey A chave da tela para a qual as permissões devem ser verificadas.
 * @returns Um objeto com as permissões booleanas para aquela tela.
 */
export async function getCookiePermissions(screenKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const session = parseSession(sessionCookie);

  return {
    canView: hasPermission(session, screenKey, 'view'),
    canCreate: hasPermission(session, screenKey, 'create'),
    canEdit: hasPermission(session, screenKey, 'edit'),
    canDelete: hasPermission(session, screenKey, 'delete'),
  };
}
