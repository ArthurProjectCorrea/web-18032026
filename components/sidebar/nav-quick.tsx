'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from './app-sidebar';

export function NavQuick({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ações Rápidas</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={pathname === item.url}
              className="text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {item.url ? (
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ) : (
                <>
                  {item.icon}
                  <span>{item.title}</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
