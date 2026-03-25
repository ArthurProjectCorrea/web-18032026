'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Save } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { createUser, updateUser } from '@/lib/actions/user-actions';
import { UserData } from '@/types/user';
import { DepartmentData } from '@/types/department';
import { PositionData } from '@/types/position';

interface UserFormProps {
  data?: UserData;
  close?: () => void;
}

export function UserForm({ data, close }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);

  const isEdit = !!data;

  // Form State
  const [name, setName] = React.useState(data?.name || '');
  const [email, setEmail] = React.useState(data?.email || '');
  const [registration, setRegistration] = React.useState(
    data?.registration || ''
  );
  const [selectedPositionId, setSelectedPositionId] = React.useState<string>(
    data?.position?.id?.toString() || ''
  );
  const [selectedDepartmentId, setSelectedDepartmentId] =
    React.useState<string>(data?.position?.department?.id?.toString() || '');

  // Data for Selects
  const [positions, setPositions] = React.useState<PositionData[]>([]);
  const [departments, setDepartments] = React.useState<DepartmentData[]>([]);

  React.useEffect(() => {
    async function fetchInitialData() {
      try {
        setIsInitializing(true);
        const [posData, deptData] = await Promise.all([
          fetchApi<PositionData[]>('/api/positions'),
          fetchApi<DepartmentData[]>('/api/departments'),
        ]);

        setPositions(posData || []);
        setDepartments(deptData || []);
      } catch (error: unknown) {
        console.error('Erro ao carregar dados iniciais:', error);
        toast.error(
          'Não foi possível carregar os dados de departamentos e cargos.'
        );
      } finally {
        setIsInitializing(false);
      }
    }
    fetchInitialData();
  }, []);

  const filteredPositions = positions.filter(
    (p) =>
      !selectedDepartmentId ||
      p.department_id.toString() === selectedDepartmentId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPositionId) {
      toast.error('Por favor, selecione um cargo para o usuário.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit) {
        await updateUser(data!.id, {
          name,
          registration,
          position_id: parseInt(selectedPositionId),
        });
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await createUser({
          name,
          email,
          registration,
          position_id: parseInt(selectedPositionId),
        });
        toast.success(
          'Usuário criado com sucesso! As credenciais foram enviadas por e-mail.'
        );
      }

      if (close) close();
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao processar usuário:', error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Spinner className="text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in space-y-6 duration-300"
    >
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
              Nome Completo
            </FieldLabel>
            <Input
              placeholder="Ex: Arthur Corrêa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="bg-background focus-visible:ring-primary/30"
            />
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
              Endereço de E-mail
            </FieldLabel>
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isEdit}
              className="bg-background focus-visible:ring-primary/30"
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
              Departamento (Filtro)
            </FieldLabel>
            <Select
              value={selectedDepartmentId}
              onValueChange={(val) => {
                setSelectedDepartmentId(val);
                setSelectedPositionId(''); // Limpa o cargo ao trocar de departamento
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por departamento..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
              Cargo
            </FieldLabel>
            <Select
              value={selectedPositionId}
              onValueChange={setSelectedPositionId}
              disabled={isLoading || !selectedDepartmentId}
            >
              <SelectTrigger className="bg-background">
                <SelectValue
                  placeholder={
                    selectedDepartmentId
                      ? 'Selecionar cargo...'
                      : 'Selecione um departamento primeiro'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredPositions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id.toString()}>
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field className="md:max-w-[50%]">
          <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
            Matrícula (Opcional)
          </FieldLabel>
          <Input
            placeholder="Ex: 2024.001"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            disabled={isLoading}
            className="bg-background focus-visible:ring-primary/30"
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
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
          {isEdit ? 'Salvar Alterações' : 'Criar Usuário'}
        </Button>
      </div>
    </form>
  );
}
