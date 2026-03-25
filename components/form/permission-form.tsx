'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { updatePermission } from '@/lib/actions/permission-actions';
import { Permission } from '@/types/permission';

interface PermissionFormProps {
  data?: Permission;
  close: () => void;
}

export function PermissionForm({ data, close }: PermissionFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    if (!name.trim()) {
      toast.error('O nome da permissão é obrigatório.');
      return;
    }

    try {
      setIsLoading(true);
      await updatePermission(data.id, { name });
      toast.success('Permissão atualizada com sucesso!');
      close();
    } catch (error: unknown) {
      toast.error(
        'Erro ao atualizar permissão: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in space-y-6 duration-300"
    >
      <FieldGroup>
        <div className="grid gap-6">
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
              Chave (Não editável)
            </FieldLabel>
            <Input
              value={data?.name_key}
              disabled
              className="bg-muted opacity-80"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="name"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              Nome da Permissão
            </FieldLabel>
            <Input
              id="name"
              name="name"
              defaultValue={data?.name || ''}
              placeholder="Ex: Visualizar"
              required
              disabled={isLoading}
              autoFocus
              className="bg-background focus-visible:ring-primary/20"
            />
          </Field>
        </div>

        <Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={close}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px] font-bold"
            >
              {isLoading ? (
                <Spinner className="mr-2 h-4 w-4" />
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
