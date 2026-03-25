'use server';

import { fetchApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createDepartment(data: { name: string }) {
  const result = await fetchApi('/api/departments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  revalidatePath('/admin/departments');
  return result;
}

export async function updateDepartment(id: number, data: { name: string }) {
  const result = await fetchApi(`/api/departments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  revalidatePath('/admin/departments');
  return result;
}

export async function deleteDepartment(id: number) {
  const result = await fetchApi(`/api/departments/${id}`, {
    method: 'DELETE',
  });
  revalidatePath('/admin/departments');
  return result;
}
