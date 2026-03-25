'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from './app-sidebar';

export function NavMain({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const subItems = item.items;

          // If the item acts strictly as a grouping folder (no url) and all its subItems are forbidden, hide it entirely
          if (!item.url && (!subItems || subItems.length === 0)) return null;

          const isItemActive = (item.url || '') === pathname;
          const isAnySubItemActive = subItems?.some((sub) => {
            const url = sub.url || '';
            const currentPath = pathname || '';
            return (
              currentPath === url ||
              (url !== '/' && currentPath.startsWith(url))
            );
          });
          const shouldBeOpen = item.isActive || isAnySubItemActive;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={shouldBeOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {subItems?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        asChild={!!item.url}
                        isActive={isItemActive}
                        className={cn(isAnySubItemActive && 'font-medium')}
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
                    </CollapsibleTrigger>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90">
                        <ChevronRightIcon />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isItemActive}
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
                )}

                {subItems?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {subItems.map((subItem) => {
                        const subUrl = subItem.url || '';
                        const currentPath = pathname || '';
                        const isSubActive =
                          subUrl === currentPath ||
                          (subUrl !== '/' && currentPath.startsWith(subUrl));

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                            >
                              <Link href={subUrl || '#'}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
