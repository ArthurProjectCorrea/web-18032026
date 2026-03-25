'use client';

import * as React from 'react';
import { MtLogo } from '@/components/mt-logo';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavQuick } from '@/components/sidebar/nav-quick';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { sidebarData } from '@/components/sidebar/sidebar';
import { hasPermission } from '@/lib/permissions';
import { ACTIONS } from '@/configs/permissions';
import { useSessionStore } from '@/lib/store/use-session-store';

interface SidebarItem {
  title: string;
  url?: string;
  icon?: React.ReactNode;
  screen?: string;
  items?: SidebarItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session, refresh } = useSessionStore();

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredNavMain = React.useMemo(() => {
    return sidebarData.navMain
      .map((item) => {
        // Se tiver sub-itens, filtra os sub-itens primeiro
        if (item.items) {
          const filteredItems = item.items.filter(
            (sub) =>
              !sub.screen || hasPermission(session, sub.screen, ACTIONS.VIEW)
          );
          return { ...item, items: filteredItems };
        }
        return item;
      })
      .filter((item) => {
        // Se não tiver sub-itens, verifica a permissão do item principal
        if (item.items) return item.items.length > 0;
        return (
          !(item as SidebarItem).screen ||
          hasPermission(
            session,
            (item as SidebarItem).screen as string,
            ACTIONS.VIEW
          )
        );
      });
  }, [session]);

  const filteredQuickActions = React.useMemo(() => {
    return sidebarData.quickActions.filter(
      (action) =>
        !action.screen || hasPermission(session, action.screen, ACTIONS.VIEW)
    );
  }, [session]);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="dark:bg-sidebar/50 flex h-16 items-center justify-center bg-white/50 backdrop-blur">
        <div className="px-6">
          <MtLogo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavQuick items={filteredQuickActions} />
        <NavMain items={filteredNavMain} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
