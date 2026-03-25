import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex min-h-[400px] w-full flex-1 flex-col items-center justify-center gap-4">
      <Spinner className="h-10 w-10" />
      <p className="text-muted-foreground animate-pulse text-sm font-medium">
        Carregando informações...
      </p>
    </div>
  );
}
