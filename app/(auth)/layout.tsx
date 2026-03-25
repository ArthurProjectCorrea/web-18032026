import { MtLogo } from '@/components/mt-logo';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10 lg:p-12">
        <div className="flex justify-center md:justify-start">
          <div className="w-40 transition-opacity hover:opacity-80">
            <MtLogo />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center py-10 md:py-20">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md duration-500">
            {children}
          </div>
        </div>
      </div>
      <div className="bg-muted border-border/50 relative hidden overflow-hidden border-l lg:block">
        <Image
          src="/auth-image.jpg"
          alt="Pantanal de Mato Grosso"
          fill
          className="absolute inset-0 object-cover transition-transform duration-10000 hover:scale-105 dark:brightness-[0.4] dark:grayscale-[0.5]"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/30" />
      </div>
    </div>
  );
}
