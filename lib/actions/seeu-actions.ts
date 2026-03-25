import { fetchApi } from '@/lib/api';
import { SeeuService, Person } from '@/types/seeu-service';

export async function getSeeuServices(): Promise<SeeuService[]> {
  return fetchApi('/api/admin/seeu-service', {
    cache: 'no-store',
  });
}

export async function getSeeuService(id: string): Promise<SeeuService> {
  return fetchApi(`/api/admin/seeu-service/${id}`);
}

export async function createSeeuService(data: {
  lawsuit_id: string;
  proof_of_residence: string;
  proof_of_employment: string;
  proof_of_legal_waiver?: string;
}) {
  return fetchApi('/api/admin/seeu-service', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function checkMonthlySignatureAction(
  cpf: string,
  lawsuit_number: string
): Promise<boolean> {
  try {
    const data = await fetchApi(
      `/api/admin/seeu-service/check-monthly?cpf=${encodeURIComponent(cpf)}&lawsuit=${encodeURIComponent(lawsuit_number)}`
    );
    return !!data?.hasSignatureThisMonth;
  } catch {
    return false; // se falhar a rede, preferível tentar avançar.
  }
}

export async function deleteSeeuService(id: string) {
  return fetchApi(`/api/admin/seeu-service/${id}`, {
    method: 'DELETE',
  });
}

export async function getSchooling(): Promise<{ id: number; name: string }[]> {
  return fetchApi('/api/admin/schooling');
}

export async function getPenaltyRegimes(): Promise<
  { id: number; name: string }[]
> {
  return fetchApi('/api/admin/penalty-regime');
}

export async function getPersonByCpf(cpf: string): Promise<Person | null> {
  try {
    return await fetchApi(`/api/admin/people/by-cpf/${cpf}`);
  } catch {
    return null;
  }
}

export async function searchCepAction(cep: string): Promise<{
  id: number;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
} | null> {
  try {
    return await fetchApi(`/api/admin/cep/${cep.replace(/\D/g, '')}`);
  } catch {
    return null;
  }
}

export async function createFullPerson(data: Record<string, unknown>) {
  return fetchApi('/api/admin/people', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
