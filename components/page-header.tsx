'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {/* <Button className='px-2 py-4' variant="outline" onClick={() => router.back()}>
          <span>Voltar</span>
        </Button> */}
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
