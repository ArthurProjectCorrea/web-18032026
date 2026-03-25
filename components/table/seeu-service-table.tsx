'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
  createDateColumn,
  createCustomColumn,
} from '@/components/ui/data-table/column-helpers';
import { Printer, User } from 'lucide-react';
import { SeeuService } from '@/types/seeu-service';
import { maskCpf, maskLawsuit } from '@/lib/utils';
import { toast } from 'sonner';
import { deleteSeeuService } from '@/lib/actions/seeu-actions';
import { generatePdfFromHtml } from '@/lib/services/pdf-service';
import { AttendanceForm } from '@/components/template/attendance-form';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { UserAvatarCard } from '@/components/button/user-avatar-card';

interface SeeuServiceTableProps {
  data: SeeuService[];
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canPrint?: boolean;
  };
}

const columns: ColumnDef<SeeuService>[] = [
  createCustomColumn(
    'lawsuit.person.name',
    'Pessoa',
    ({ row }) => {
      const person = row.original.lawsuit?.person;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <User className="text-primary h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{person?.name || 'N/A'}</span>
            <span className="text-muted-foreground text-xs">
              {maskCpf(person?.cpf || '')}
            </span>
          </div>
        </div>
      );
    },
    { id: 'person_name' }
  ),
  createCustomColumn(
    'lawsuit.number',
    'Processo',
    ({ value }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">
          {maskLawsuit(String(value || ''))}
        </span>
      </div>
    ),
    { id: 'lawsuit_number' }
  ),
  createDateColumn('created_at', 'Data de Registro'),
  {
    accessorKey: 'created_by',
    header: 'Atendente',
    meta: { title: 'Atendente' },
    cell: ({ row }) => {
      const creator = row.original.creator_profile;

      return (
        <UserAvatarCard
          user={{
            name: creator?.name || row.original.created_by,
            avatar_url: creator?.avatar_url || null,
            position: creator?.position
              ? {
                  name: creator.position.name,
                  department: creator.position.department ?? null,
                }
              : null,
          }}
          showName
          className="hover:opacity-100"
        />
      );
    },
  },
];

export function SeeuServiceTable({ data, permissions }: SeeuServiceTableProps) {
  const [printingId, setPrintingId] = React.useState<string | null>(null);

  const handleDelete = async (service: SeeuService) => {
    await deleteSeeuService(service.id);
  };

  const handlePrint = async (service: SeeuService) => {
    setPrintingId(service.id);
    toast.info('Gerando PDF...');
    setTimeout(async () => {
      try {
        await generatePdfFromHtml(
          `print-${service.id}`,
          `atendimento_${service.lawsuit?.person?.cpf}.pdf`
        );
        toast.success('PDF gerado!');
      } catch {
        toast.error('Erro ao gerar PDF');
      } finally {
        setPrintingId(null);
      }
    }, 500);
  };

  return (
    <>
      <DataTable<SeeuService, unknown>
        columns={columns}
        data={data}
        filterColumn="lawsuit_number"
        filterPlaceholder="Filtrar por processo..."
        permissions={permissions}
        onDelete={handleDelete}
        createLink="/seeu-service/create"
        editLink={(row: SeeuService) => `/seeu-service/${row.id}`}
        additionalActions={(service: SeeuService) => (
          <>
            <DropdownMenuItem
              onClick={() => handlePrint(service)}
              disabled={!!printingId}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Termo
            </DropdownMenuItem>
          </>
        )}
      />

      {/* Hidden print areas */}
      {printingId && (
        <div className="fixed top-[-9999px] left-[-9999px]">
          {data
            .filter((s) => s.id === printingId)
            .map((service) => (
              <div key={`print-area-${service.id}`} id={`print-${service.id}`}>
                <AttendanceForm data={service} />
              </div>
            ))}
        </div>
      )}
    </>
  );
}
