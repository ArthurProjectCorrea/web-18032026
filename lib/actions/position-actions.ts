'use server';

import { fetchApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import {
  CreatePositionData,
  UpdatePositionData,
  AccessItem,
} from '@/types/position';
import { Scope } from '@/configs/permissions';

export async function createPosition(data: CreatePositionData) {
  const result = await fetchApi('/api/positions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  revalidatePath('/admin/positions');
  return result;
}

export async function updatePosition(id: number, data: UpdatePositionData) {
  const result = await fetchApi(`/api/positions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  revalidatePath('/admin/positions');
  return result;
}

export async function getPositionAccesses(id: number): Promise<AccessItem[]> {
  try {
    const position = await fetchApi(`/api/positions/${id}`);
    return (position.accesses || []).map(
      (access: {
        screen_id: number;
        permission_id: number;
        scope: string;
        screen?: { name: string };
        permission?: { name: string };
      }) => ({
        screen_id: access.screen_id,
        permission_id: access.permission_id,
        screen_name: access.screen?.name,
        permission_name: access.permission?.name,
        scope: access.scope as Scope,
      })
    );
  } catch (error: unknown) {
    console.error('Erro ao buscar acessos do cargo:', error);
    return [];
  }
}

export async function deletePosition(id: number) {
  const result = await fetchApi(`/api/positions/${id}`, {
    method: 'DELETE',
  });
  revalidatePath('/admin/positions');
  return result;
}
