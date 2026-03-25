'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/lib/actions/user-actions';
import { toast } from 'sonner';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { RefreshCw, Save } from 'lucide-react';
import { syncPermissionsAction } from '@/lib/actions/auth-actions';

import { ProfileSettingsFormProps } from '@/types/user';

export function ProfileSettingsForm({
  user,
  onSuccess,
  className,
}: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [errorName, setErrorName] = React.useState<string | undefined>();

  async function handleSync() {
    try {
      setIsSyncing(true);
      const res = await syncPermissionsAction();
      if (res.success) {
        toast.success('Dados e permissões recarregados!');
        // Opcional: recarregar a página para garantir que tudo (incluindo client-side stores) seja atualizado
        window.location.reload();
      } else {
        toast.error('Erro ao recarregar: ' + res.error);
      }
    } catch {
      toast.error('Erro ao sincronizar dados');
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    if (!name || name.length < 2) {
      setErrorName('Nome deve ter pelo menos 2 caracteres.');
      return;
    }
    setErrorName(undefined);

    try {
      setIsLoading(true);
      await updateUser(user.id, {
        name,
        registration: formData.get('registration') as string,
      });

      // Auto-sync permissions/data to "cache"
      const res = await syncPermissionsAction();

      if (res.success) {
        // Atualiza o estado global do Zustand para refletir na sidebar instantaneamente
        const { useSessionStore } =
          await import('@/lib/store/use-session-store');
        useSessionStore.getState().refresh();
        toast.success('Perfil atualizado com sucesso!');
      } else {
        toast.warning(
          'Perfil atualizado, mas houve erro ao sincronizar permissões.'
        );
      }

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      toast.error(
        'Erro ao atualizar perfil: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('animate-in fade-in duration-300', className)}
    >
      <FieldGroup className="py-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="name"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              Nome
            </FieldLabel>
            <Input
              id="name"
              name="name"
              defaultValue={user.name || ''}
              placeholder="Seu nome completo"
              className="bg-background focus-visible:ring-primary/20"
            />
            {errorName && (
              <p className="text-destructive mt-1 text-sm">{errorName}</p>
            )}
          </Field>

          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              E-mail
            </FieldLabel>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted cursor-not-allowed opacity-80"
            />
            <p className="text-muted-foreground mt-1.5 px-1 text-[10px]">
              * O E-mail não pode ser alterado.
            </p>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="registration"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              Matrícula
            </FieldLabel>
            <Input
              id="registration"
              name="registration"
              defaultValue={user.registration || ''}
              placeholder="Sua matrícula funcional"
              className="bg-background focus-visible:ring-primary/20"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="department"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              Departamento
            </FieldLabel>
            <Input
              id="department"
              value={user.department || 'Não informado'}
              disabled
              className="bg-muted cursor-not-allowed opacity-80"
            />
            <p className="text-muted-foreground mt-1.5 px-1 text-[10px]">
              * O Departamento só pode ser alterado por um administrador.
            </p>
          </Field>

          <Field>
            <FieldLabel
              htmlFor="position"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              Cargo
            </FieldLabel>
            <Input
              id="position"
              value={user.position || 'Não informado'}
              disabled
              className="bg-muted cursor-not-allowed opacity-80"
            />
            <p className="text-muted-foreground mt-1.5 px-1 text-[10px]">
              * O Cargo só pode ser alterado por um administrador.
            </p>
          </Field>
        </div>

        <Field>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading || isSyncing}
              onClick={handleSync}
              className="flex-1 font-semibold"
            >
              {isSyncing ? (
                <Spinner className="mr-2" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Recarregar Dados
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSyncing}
              className="flex-1 font-bold"
            >
              {isLoading ? (
                <Spinner className="mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
