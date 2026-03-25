'use client';

import { useEffect, useState } from 'react';
import { getCookie, UserSession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPermsPage() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const checkSession = () => {
      const sessionCookie = getCookie('session');
      if (sessionCookie) {
        try {
          const parsedSession = JSON.parse(sessionCookie);
          setSession(parsedSession);
        } catch (e) {
          console.error('Erro ao parsar cookie de sessão', e);
        }
      }
    };
    checkSession();
  }, []);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Nenhuma sessão encontrada. Faça login primeiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Debug de Permissões</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
              {JSON.stringify(session.profile, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
              {JSON.stringify(session.permissions, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Token ID</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="bg-muted rounded-md p-4 font-mono text-xs break-all">
            {session.token}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
