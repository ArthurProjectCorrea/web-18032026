export const dynamic = 'force-dynamic';

import { SeeuServiceForm } from '@/components/form/seeu-service-form';
import {
  getSeeuService,
  getSchooling,
  getPenaltyRegimes,
} from '@/lib/actions/seeu-actions';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SeeuServiceDetailPage({ params }: Props) {
  const { id } = await params;

  const [initialData, schooling, penaltyRegimes] = await Promise.all([
    getSeeuService(id),
    getSchooling(),
    getPenaltyRegimes(),
  ]);

  if (!initialData) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title={`Editar Atendimento #${id.substring(0, 8)}`}
        description={`Visualizando registro de ${new Date(initialData.created_at).toLocaleDateString('pt-BR')}.`}
      />

      <div className="flex-1">
        <SeeuServiceForm
          initialData={initialData}
          schooling={schooling}
          penaltyRegimes={penaltyRegimes}
        />
      </div>
    </div>
  );
}
