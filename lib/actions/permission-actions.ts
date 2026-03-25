'use client';

export async function createPermission(data: {
  name: string;
  name_key: string;
}) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  const response = await fetch('/api/permissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Falha ao criar permissão');
  return response.json();
}

export async function updatePermission(
  id: number,
  data: { name?: string; name_key?: string }
) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  const response = await fetch(`/api/permissions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Falha ao atualizar permissão');
  return response.json();
}

export async function deletePermission(id: number) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  const response = await fetch(`/api/permissions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Falha ao deletar permissão');
  return response.json();
}
