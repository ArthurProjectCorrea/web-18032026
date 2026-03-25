import { fetchApi } from '@/lib/api';
import { PositionForm } from '@/components/form/position-form';
import { PageHeader } from '@/components/page-header';
import { notFound } from 'next/navigation';

interface EditPositionPageProps {
  params: Promise<{ id: string }>;
}

async function getPosition(id: string) {
  try {
    const position = await fetchApi(`/api/positions/${id}`, {
      cache: 'no-store',
    });
    return position;
  } catch (error) {
    console.error('Error loading position for edit:', error);
    return null;
  }
}

export default async function EditPositionPage({
  params,
}: EditPositionPageProps) {
  const { id } = await params;
  const position = await getPosition(id);

  if (!position) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader
        title={`Editar Cargo: ${position.name}`}
        description="Ajuste as propriedades do cargo e suas permissões de acesso."
      />
      <div className="flex-1">
        <PositionForm data={position} />
      </div>
    </div>
  );
}
