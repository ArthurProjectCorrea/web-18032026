'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { updateScreen } from '@/lib/actions/screen-actions';
import { Screen } from '@/types/screen';

interface ScreenFormProps {
  data?: Screen;
  close: () => void;
}

export function ScreenForm({ data, close }: ScreenFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    if (!name.trim()) {
      toast.error('O nome da tela é obrigatório.');
      return;
    }

    try {
      setIsLoading(true);
      await updateScreen(data.id, { name });
      toast.success('Tela atualizada com sucesso!');
      close();
    } catch (error: unknown) {
      toast.error(
        'Erro ao atualizar tela: ' +
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
          <FieldLabel htmlFor="name">Nome da Tela</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={data?.name || ''}
            placeholder="Ex: Gerenciamento de Usuários"
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
