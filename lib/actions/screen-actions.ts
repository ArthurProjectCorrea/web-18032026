import { fetchApi } from '@/lib/api';

export async function getScreenName(key: string) {
  try {
    const data = await fetchApi(`/api/admin/screens/key/${key}`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });
    return data?.name || key;
  } catch (error) {
    console.error('Erro ao buscar nome da tela:', error);
    return key;
  }
}

export async function updateScreen(
  id: number,
  data: {
    name?: string;
  }
) {
  return fetchApi(`/api/admin/screens/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

// createScreen e deleteScreen removidos conforme restrição do sistema (apenas edição de nome permitida)
