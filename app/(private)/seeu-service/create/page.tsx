export const dynamic = 'force-dynamic';

import { SeeuServiceForm } from '@/components/form/seeu-service-form';
import { getSchooling, getPenaltyRegimes } from '@/lib/actions/seeu-actions';
import { PageHeader } from '@/components/page-header';

export default async function CreateSeeuServicePage() {
  const [schooling, penaltyRegimes] = await Promise.all([
    getSchooling(),
    getPenaltyRegimes(),
  ]);

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title="Novo Atendimento"
        description="Preencha os dados da pessoa e do processo para gerar o termo de comparecimento."
      />

      <div className="flex-1">
        <SeeuServiceForm
          schooling={schooling}
          penaltyRegimes={penaltyRegimes}
        />
      </div>
    </div>
  );
}
