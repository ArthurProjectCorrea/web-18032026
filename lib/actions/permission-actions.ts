import { fetchApi } from '@/lib/api';

export async function updatePermission(id: number, data: { name?: string }) {
  return fetchApi(`/api/admin/permissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

// createPermission e deletePermission removidos conforme restrição do sistema
