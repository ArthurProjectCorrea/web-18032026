'use client';

import { Button } from '@/components/ui/button';
import { ShieldAlertIcon, UserMinusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getCookie } from '@/lib/auth';
import { parseSession } from '@/lib/permissions';

export default function Forbidden() {
  const [hasPosition, setHasPosition] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPosition = () => {
      try {
        const session = parseSession(getCookie('session'));
        if (session && session.profile) {
          setHasPosition(!!session.profile.position);
        }
      } catch (error) {
        console.error('Error checking position:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkPosition();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Spinner className="text-primary h-8 w-8" />
      </div>
    );
  }

  const isMissingPosition = hasPosition === false;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div
        className={
          isMissingPosition
            ? 'bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-full'
            : 'bg-destructive/10 text-destructive flex h-20 w-20 items-center justify-center rounded-full'
        }
      >
        {isMissingPosition ? (
          <UserMinusIcon className="h-10 w-10" />
        ) : (
          <ShieldAlertIcon className="h-10 w-10" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter text-balance sm:text-4xl">
          {isMissingPosition ? 'Seja bem-vindo!' : 'Acesso Negado'}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-[600px] text-balance md:text-xl/relaxed">
          {isMissingPosition ? (
            <>
              No momento, não há um <span className="font-bold">Cargo</span>{' '}
              vinculado ao seu usuário.
              <br />
              Por favor, entre em contato com seu superior imediato para
              regularizar seu acesso.
            </>
          ) : (
            'Você não possui permissão para acessar esta tela. Caso acredite que isso seja um erro, entre em contato com o administrador do sistema.'
          )}
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
}
