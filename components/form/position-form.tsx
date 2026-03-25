'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  createPosition,
  updatePosition,
  getPositionAccesses,
} from '@/lib/actions/position-actions';
import { fetchApi } from '@/lib/api';
import {
  Plus,
  X,
  Shield,
  Settings2,
  Info,
  ChevronLeft,
  Save,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useBreadcrumbStore } from '@/lib/store/use-breadcrumb-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { PositionFormProps, AccessItem } from '@/types/position';
import { Scope } from '@/configs/permissions';

export function PositionForm({ data, close }: PositionFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setOverride } = useBreadcrumbStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [departments, setDepartments] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [screens, setScreens] = React.useState<
    { id: number; name: string; is_sub_screen?: boolean }[]
  >([]);
  const [permissions, setPermissions] = React.useState<
    { id: number; name: string }[]
  >([]);

  const [name, setName] = React.useState(data?.name || '');
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>(
    data?.department_id?.toString() || ''
  );
  const [selectedScreenId, setSelectedScreenId] = React.useState<string>('');
  const [selectedPermissionId, setSelectedPermissionId] =
    React.useState<string>('');
  const [selectedScope, setSelectedScope] = React.useState<string>('all');
  const [accessesList, setAccessesList] = React.useState<AccessItem[]>([]);

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsInitializing(true);
        const [depts, scrs, perms] = await Promise.all([
          fetchApi<{ id: number; name: string }[]>('/api/departments'),
          fetchApi<{ id: number; name: string; is_sub_screen: boolean }[]>(
            '/api/admin/screens'
          ),
          fetchApi<{ id: number; name: string }[]>('/api/admin/permissions'),
        ]);

        setDepartments(depts || []);
        setScreens((scrs || []).filter((s) => !s.is_sub_screen));
        setPermissions(perms || []);

        if (data?.id) {
          const currentAccesses = await getPositionAccesses(data.id);
          setAccessesList(currentAccesses);
        }
      } catch (error: unknown) {
        console.error('Error fetching position form data:', error);
        toast.error('Erro ao carregar dados do formulário.');
      } finally {
        setIsInitializing(false);
      }
    };
    fetchInitialData();
  }, [data?.id]);

  React.useEffect(() => {
    if (data?.id && name) {
      setOverride(pathname, name);
    }
  }, [data?.id, name, pathname, setOverride]);

  const handleAddAccess = () => {
    if (!selectedScreenId || !selectedPermissionId) return;

    const screen = screens.find((s) => s.id.toString() === selectedScreenId);
    const permission = permissions.find(
      (p) => p.id.toString() === selectedPermissionId
    );

    if (screen && permission) {
      const exists = accessesList.some(
        (a) => a.screen_id === screen.id && a.permission_id === permission.id
      );

      if (exists) {
        toast.error('Esta combinação de tela e permissão já foi adicionada.');
        return;
      }

      setAccessesList([
        ...accessesList,
        {
          screen_id: screen.id,
          permission_id: permission.id,
          screen_name: screen.name,
          permission_name: permission.name,
          scope: selectedScope as Scope,
        },
      ]);
      setSelectedScreenId('');
      setSelectedPermissionId('');
      setSelectedScope('all');
    }
  };

  const handleRemoveSpecificAccess = (
    screenId: number,
    permissionId: number
  ) => {
    setAccessesList(
      accessesList.filter(
        (a) => !(a.screen_id === screenId && a.permission_id === permissionId)
      )
    );
  };

  const groupedAccesses = React.useMemo(() => {
    return accessesList.reduce(
      (acc, access) => {
        const screenId = access.screen_id;
        if (!acc[screenId]) {
          acc[screenId] = {
            name: access.screen_name,
            permissions: [],
          };
        }
        acc[screenId].permissions.push(access);
        return acc;
      },
      {} as Record<number, { name: string; permissions: AccessItem[] }>
    );
  }, [accessesList]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !name.trim()) {
      toast.error('O nome do cargo é obrigatório.');
      return;
    }

    if (!selectedDepartment) {
      toast.error('É obrigatório selecionar um departamento.');
      return;
    }

    try {
      setIsLoading(true);
      const accessesPayload = accessesList.map((a) => ({
        screen_id: a.screen_id,
        permission_id: a.permission_id,
        scope: a.scope,
      }));

      if (data?.id) {
        await updatePosition(data.id, {
          name,
          department_id: parseInt(selectedDepartment),
          accesses: accessesPayload,
        });
        toast.success('Cargo atualizado com sucesso!');
      } else {
        await createPosition({
          name,
          department_id: parseInt(selectedDepartment),
          accesses: accessesPayload,
        });
        toast.success('Cargo criado com sucesso!');
      }

      if (close) {
        close();
      } else {
        router.push('/admin/positions');
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar cargo'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Spinner className="h-8 w-8" />
        <p className="text-muted-foreground mt-4 animate-pulse text-sm">
          Carregando configurações de acesso...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in flex w-full flex-col duration-300"
    >
      <FieldGroup className="gap-8">
        {/* Seção 1: Informações Gerais */}
        <section className="space-y-4">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-base font-semibold">
                Identificação do Cargo
              </CardTitle>
              <CardDescription>
                Dados básicos para identificação e vinculação estrutural.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="name"
                  className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
                >
                  Nome do Cargo
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Desenvolvedor Senior"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  className="bg-background focus-visible:ring-primary/20"
                />
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                  Departamento vinculado
                </FieldLabel>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-background focus-visible:ring-primary/20 w-full">
                    <SelectValue placeholder="Selecione um departamento..." />
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
            </CardContent>
          </Card>
        </section>

        {/* Seção 2: Acessos e Permissões */}
        <section className="space-y-4">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-base font-semibold">
                Configuração de Telas
              </CardTitle>
              <CardDescription>
                Defina quais telas e ações este cargo está autorizado a
                realizar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* Seletor de Acessos */}
              <div className="bg-muted/40 border-primary/5 grid grid-cols-1 items-end gap-4 rounded-2xl border p-6 shadow-sm transition-all md:grid-cols-4">
                <Field>
                  <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                    Módulo / Tela
                  </FieldLabel>
                  <Select
                    value={selectedScreenId}
                    onValueChange={setSelectedScreenId}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecionar tela..." />
                    </SelectTrigger>
                    <SelectContent>
                      {screens.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                    Ação Permitida
                  </FieldLabel>
                  <Select
                    value={selectedPermissionId}
                    onValueChange={setSelectedPermissionId}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecionar ação..." />
                    </SelectTrigger>
                    <SelectContent>
                      {permissions.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                    Visibilidade de Dados
                  </FieldLabel>
                  <Select
                    value={selectedScope}
                    onValueChange={setSelectedScope}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Escopo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tudo (Global)</SelectItem>
                      <SelectItem value="department">
                        Apenas Departamento
                      </SelectItem>
                      <SelectItem value="own">Apenas Próprio</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Button
                  type="button"
                  className="w-full font-bold shadow-sm"
                  onClick={handleAddAccess}
                  disabled={
                    isLoading || !selectedScreenId || !selectedPermissionId
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Vincular Acesso
                </Button>
              </div>

              {/* Lista de Permissões Vinculadas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-foreground flex items-center gap-2 font-semibold">
                    <Settings2 className="text-primary h-4 w-4" />
                    Grade de Permissões Atual
                  </h4>
                  <span className="text-muted-foreground bg-muted rounded-full border px-2 py-1 text-xs">
                    {accessesList.length} permissão(ões) vinculada(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.keys(groupedAccesses).length === 0 ? (
                    <div className="text-muted-foreground bg-muted/10 col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center shadow-inner">
                      <div className="bg-background mb-4 rounded-full p-4 shadow-sm">
                        <Shield className="text-primary/20 h-10 w-10" />
                      </div>
                      <p className="text-lg font-medium">Sem vínculos ativos</p>
                      <p className="mt-1 max-w-xs px-4 text-sm opacity-60">
                        Utilize o seletor acima para adicionar permissões
                        específicas para este cargo.
                      </p>
                    </div>
                  ) : (
                    (
                      Object.entries(groupedAccesses) as [
                        string,
                        { name: string; permissions: AccessItem[] },
                      ][]
                    ).map(([screenId, group]) => (
                      <div
                        key={`screen-${screenId}`}
                        className="bg-background group animate-in fade-in slide-in-from-bottom-2 border-primary/10 hover:border-primary/30 rounded-2xl border p-5 transition-all hover:shadow-lg"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="bg-primary/10 mr-3 rounded-lg p-1.5">
                            <Info className="text-primary h-4 w-4" />
                          </div>
                          <h5 className="text-foreground flex-1 truncate text-sm font-bold tracking-tight">
                            {group.name}
                          </h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.permissions.map((access: AccessItem) => (
                            <div
                              key={`${screenId}-${access.permission_id}`}
                              className="bg-muted hover:bg-muted/80 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold shadow-sm transition-all"
                            >
                              <span className="text-foreground/80">
                                {access.permission_name}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold text-white uppercase ${
                                  access.scope === 'all'
                                    ? 'bg-indigo-500'
                                    : access.scope === 'department'
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                }`}
                              >
                                {access.scope === 'all'
                                  ? 'Global'
                                  : access.scope === 'department'
                                    ? 'Depto'
                                    : 'Eu'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSpecificAccess(
                                    Number(screenId),
                                    access.permission_id
                                  )
                                }
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ações Rodapé */}
        <Field>
          <div className="mt-6 flex items-center justify-end gap-4 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={close || (() => router.back())}
              disabled={isLoading}
              className="px-8 font-bold"
            >
              {close ? (
                'Cancelar'
              ) : (
                <div className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </div>
              )}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[180px] font-bold shadow-sm"
            >
              {isLoading ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {data ? 'Salvar Alterações' : 'Criar Cargo'}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
