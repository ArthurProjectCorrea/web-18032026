import { UserSession } from '@/lib/auth';

/**
 * Verifica se uma sessão de usuário possui uma permissão específica para uma tela.
 *
 * @param session Objeto de sessão do usuário (geralmente vindo do cookie para evitar fetch)
 * @param screen Chave da tela (ex: 'users', 'positions')
 * @param action Ação desejada (ex: 'view', 'create', 'edit', 'delete')
 * @returns boolean
 */
export function hasPermission(
  session: UserSession | null | undefined,
  screen: string,
  action: string = 'view'
): boolean {
  if (!session || !session.permissions) return false;

  // O banco retorna permissões no formato: { [screen_key]: { [action_key]: scope } }
  const screenPermissions = session.permissions[screen];

  if (!screenPermissions) return false;

  // Se houver qualquer escopo ('all', 'department', 'own') para aquela ação, o acesso básico é concedido.
  return !!screenPermissions[action];
}

/**
 * Extrai e faz o parse da sessão a partir do valor bruto do cookie 'session'.
 */
export function parseSession(
  cookieValue: string | undefined
): UserSession | null {
  if (!cookieValue) return null;
  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as UserSession;
  } catch (e) {
    console.error('Erro ao parsar sessão do cookie:', e);
    return null;
  }
}
