import { getCookie } from '@/lib/auth';
import { UpdateUserData } from '@/types/user';

export async function createUser(data: {
  name: string;
  email: string;
  position_id: number;
  registration?: string;
}) {
  const token = getCookie('token');
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar usuário');
  }

  return response.json();
}

export async function updateUser(id: string, data: UpdateUserData) {
  const token = getCookie('token');
  const response = await fetch(`/api/profiles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao atualizar perfil');
  }

  return response.json();
}

export async function deleteUser(id: string) {
  const token = getCookie('token');
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao deletar usuário');
  }

  return response.json();
}
