import { UserData } from '@/types/user';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface UserSession {
  user_id: string;
  profile: UserData;
  permissions: Record<string, Record<string, string>>;
  token: string;
}

export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();
  return { user: userCredential.user, token };
}

export async function syncUserSession(token: string) {
  try {
    console.log('Sincronizando sessão...');
    // Chamada para sincronizar perfil
    const profileRes = await fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileRes.ok) {
      throw new Error(`Erro ao buscar perfil: ${profileRes.status}`);
    }

    const profileData = await profileRes.json();
    console.log('Dados do perfil recebidos:', profileData);

    if (!profileData.profile) {
      throw new Error('Perfil não encontrado na resposta da API');
    }

    // Chamada para buscar permissões
    const permissionsRes = await fetch('/api/me/permissions', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!permissionsRes.ok) {
      throw new Error(`Erro ao buscar permissões: ${permissionsRes.status}`);
    }

    const permissionsData = await permissionsRes.json();
    console.log('Dados de permissões recebidos:', permissionsData);

    const session: UserSession = {
      user_id: profileData.profile.id,
      profile: profileData.profile,
      permissions: permissionsData.permissions || {},
      token,
    };

    // Salva no cookie como string JSON
    setCookie('session', JSON.stringify(session));
    setCookie('token', token); // Facilita leitura no middleware

    return session;
  } catch (error) {
    console.error('Falha na sincronização da sessão:', error);
    throw error;
  }
}
