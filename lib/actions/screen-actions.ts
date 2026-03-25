import { fetchApi } from '@/lib/api';

export async function getScreenName(key: string) {
  try {
    const data = await fetchApi(`/api/screens/key/${key}`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });
    return data?.name || key;
  } catch (error) {
    console.error('Erro ao buscar nome da tela:', error);
    return key;
  }
}

export async function createScreen(data: {
  name: string;
  name_key: string;
  path_pattern?: string;
  breadcrumb?: string | null;
}) {
  return fetchApi('/api/screens', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function updateScreen(
  id: number,
  data: {
    name?: string;
    name_key?: string;
    path_pattern?: string;
    breadcrumb?: string | null;
  }
) {
  return fetchApi(`/api/screens/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteScreen(id: number) {
  return fetchApi(`/api/screens/${id}`, {
    method: 'DELETE',
  });
}
