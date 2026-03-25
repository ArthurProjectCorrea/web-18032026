'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogOut, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log do erro para monitoramento
    console.error('Private Area Error:', error);

    // Se for um erro de autenticação (401), forçamos o logout limpando cookies locais
    if (error.message === 'UNAUTHORIZED' || error.status === 401) {
      document.cookie =
        'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Pequeno delay para garantir que o usuário veja a mensagem antes de ser expulso
      const timer = setTimeout(() => {
        window.location.href = '/login?expired=true';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const isAuthError = error.message === 'UNAUTHORIZED' || error.status === 401;

  return (
    <div className="animate-in fade-in flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center duration-500">
      <div className="bg-destructive/10 text-destructive mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-sm">
        <AlertCircle className="h-10 w-10" />
      </div>

      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        {isAuthError ? 'Sessão Expirada' : 'Algo deu errado'}
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md">
        {isAuthError
          ? 'Sua sessão de acesso expirou por segurança ou o banco de dados foi resetado. Você será redirecionado para o login em instantes.'
          : 'Ocorreu um erro inesperado ao carregar esta página. Nossa equipe foi notificada.'}
      </p>

      <div className="flex items-center gap-4">
        {isAuthError ? (
          <Button
            onClick={() => (window.location.href = '/login')}
            variant="default"
            className="px-8 font-bold"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Entrar Novamente
          </Button>
        ) : (
          <>
            <Button onClick={() => reset()} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
            <Button onClick={() => router.push('/')} variant="ghost">
              Voltar ao Início
            </Button>
          </>
        )}
      </div>

      {process.env.NODE_ENV === 'development' && !isAuthError && (
        <div className="bg-muted/50 mt-12 w-full max-w-2xl overflow-hidden rounded-lg border p-4 text-left font-mono text-xs opacity-60">
          <p className="mb-1 font-bold">Stack Trace:</p>
          <pre className="truncate whitespace-pre-wrap">{error.stack}</pre>
        </div>
      )}
    </div>
  );
}
