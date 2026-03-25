import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Suspense } from 'react';
import Loading from './loading';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import packageJson from '@/package.json';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Suspense fallback={null}>
              <DynamicBreadcrumb />
            </Suspense>
          </div>
          <div className="text-muted-foreground text-xs font-semibold opacity-70">
            v{packageJson.version}
          </div>
        </header>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
