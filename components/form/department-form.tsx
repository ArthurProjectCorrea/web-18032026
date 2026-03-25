'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  createDepartment,
  updateDepartment,
} from '@/lib/actions/department-actions';

import { DepartmentFormProps } from '@/types/department';
import { Save, Building2 } from 'lucide-react';

export function DepartmentForm({ data, close }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    if (!name.trim()) {
      toast.error('O nome do departamento é obrigatório.');
      return;
    }

    try {
      setIsLoading(true);
      if (data?.id) {
        await updateDepartment(data.id, { name });
        toast.success('Departamento atualizado com sucesso!');
      } else {
        await createDepartment({ name });
        toast.success('Departamento criado com sucesso!');
      }
      close();
    } catch (error: unknown) {
      toast.error(
        (data?.id
          ? 'Erro ao atualizar departamento: '
          : 'Erro ao criar departamento: ') +
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
        <Field>
          <FieldLabel
            htmlFor="name"
            className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
          >
            Nome do Departamento
          </FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={data?.name || ''}
            placeholder="Ex: Recursos Humanos"
            required
            autoCapitalize="words"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={isLoading}
            className="bg-background focus-visible:ring-primary/20"
          />
        </Field>

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
              ) : data ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <Building2 className="mr-2 h-4 w-4" />
              )}
              {data ? 'Salvar Alterações' : 'Criar Departamento'}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
