'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbStore } from '@/lib/store/use-breadcrumb-store';
import { fetchApi } from '@/lib/api';

interface BreadcrumbConfigItem {
  label: string;
  href?: string;
}

interface ScreenWithBreadcrumb {
  id: number;
  name: string;
  name_key: string;
  path_pattern: string | null;
  breadcrumb: BreadcrumbConfigItem[] | null;
}

export function DynamicBreadcrumb() {
  const { overrides } = useBreadcrumbStore();
  const pathname = usePathname();
  const lowerPathname = pathname.toLowerCase();
  const [screens, setScreens] = React.useState<ScreenWithBreadcrumb[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchScreens() {
      try {
        const data = await fetchApi<ScreenWithBreadcrumb[]>('/api/screens');
        setScreens(data);
      } catch (error) {
        console.error('Erro ao buscar configurações de breadcrumb:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchScreens();
  }, []);

  // Função para encontrar trail manual considerando padrões dinâmicos [id]
  const findManualTrail = (): BreadcrumbConfigItem[] | null => {
    if (!screens.length) return null;

    // Busca exata primeiro
    const exactMatch = screens.find(
      (s) =>
        s.path_pattern === pathname ||
        (s.path_pattern && s.path_pattern.toLowerCase() === lowerPathname)
    );
    if (exactMatch?.breadcrumb) return exactMatch.breadcrumb;

    // Busca por padrões [prop]
    for (const screen of screens) {
      const key = screen.path_pattern;
      if (!key || !key.includes('[') || !key.includes(']')) continue;

      // Escapa caracteres especiais de regex e substitui [qualquer_coisa] por ([^/]+)
      const pattern = key
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\[.*?\\\]/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`, 'i');

      if (regex.test(pathname)) {
        return screen.breadcrumb as BreadcrumbConfigItem[];
      }
    }
    return null;
  };

  const manualTrail = findManualTrail();

  if (isLoading) {
    return <div className="bg-muted h-4 w-32 animate-pulse rounded" />;
  }

  if (Array.isArray(manualTrail)) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {manualTrail.map((item, index) => {
            const isLast = index === manualTrail.length - 1;
            const label = isLast
              ? overrides[lowerPathname] || item.label
              : item.label;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem className={!isLast ? 'hidden md:block' : ''}>
                  {isLast || !item.href ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Fallback to dynamic generation with database lookup per segment
  const segments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment: string, index: number) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const lowerHref = href.toLowerCase();

          // 1. Check Store Overrides first (explicit user/form sets)
          const storeOverride =
            overrides[segment.toLowerCase()] || overrides[lowerHref];

          // 2. Check Database Screens for this specific segment path
          const dbMatch = screens.find(
            (s) => s.path_pattern?.toLowerCase() === lowerHref
          );

          const label: string = storeOverride || dbMatch?.name || segment;

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem className={!isLast ? 'hidden md:block' : ''}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function BreadcrumbUpdater({ label }: { label: string | undefined }) {
  const pathname = usePathname();
  const { setOverride, removeOverride } = useBreadcrumbStore();

  React.useEffect(() => {
    if (label) {
      setOverride(pathname, label);
    }
    return () => {
      removeOverride(pathname);
    };
  }, [pathname, label, setOverride, removeOverride]);

  return null;
}
