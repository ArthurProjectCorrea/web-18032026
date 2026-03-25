import { getCookie, syncUserSession } from '@/lib/auth';

/**
 * Ação para sincronizar manualmente as permissões e dados do usuário logado.
 * Útil após atualizações de perfil ou mudanças de cargo.
 */
export async function syncPermissionsAction() {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error(
        'Token de autenticação não encontrado. Por favor, faça login novamente.'
      );
    }

    await syncUserSession(token);

    return { success: true };
  } catch (error) {
    console.error('Erro ao sincronizar permissões:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao sincronizar',
    };
  }
}
