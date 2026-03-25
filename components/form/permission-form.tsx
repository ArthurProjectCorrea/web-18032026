'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Chave (Não editável)</FieldLabel>
          <Input value={data?.name_key} disabled className="bg-muted" />
        </Field>
        <Field>
          <FieldLabel htmlFor="name">Nome da Permissão</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={data?.name || ''}
            placeholder="Ex: Visualizar"
            required
            disabled={isLoading}
            autoFocus
          />
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={close}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2" />}
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
