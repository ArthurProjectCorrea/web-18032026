import { PositionForm } from '@/components/form/position-form';
import { PageHeader } from '@/components/page-header';

export default function CreatePositionPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title="Criar Novo Cargo"
        description="Configure um novo cargo e defina suas permissões de acesso."
      />
      <div className="flex-1">
        <PositionForm />
      </div>
    </div>
  );
}
