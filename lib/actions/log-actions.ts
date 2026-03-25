'use server';

import { cookies } from 'next/headers';
import { Log } from '@/types/log';

export async function getAuditLogs(): Promise<Log[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/logs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}
