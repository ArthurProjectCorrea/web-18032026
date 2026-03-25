'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { UserProfileDialog } from '@/components/button/user-profile-dialog';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { removeCookie } from '@/lib/auth';

import { useSessionStore } from '@/lib/store/use-session-store';

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { session } = useSessionStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    removeCookie('session');
    removeCookie('token');
    toast.info('Você saiu da sua conta.');
    router.push('/login');
  };

  if (!session || !session.profile) return null;

  // Tipagem agora já vem do UserSession.profile como UserData
  const profile = session.profile;
  const userDisplayName = profile.name || 'Usuário';
  const roleDisplay = profile.position?.name || 'Sem Cargo';
  const userAvatar = profile.avatar_url || '';
  const initials = userDisplayName.substring(0, 2).toUpperCase();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userAvatar} alt={userDisplayName} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userDisplayName}
                  </span>
                  <span className="truncate text-xs">{roleDisplay}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userAvatar} alt={userDisplayName} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {userDisplayName}
                    </span>
                    <span className="truncate text-xs">{roleDisplay}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <CreditCardIcon />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <SparklesIcon />
                  Plano Pro (Em breve)
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <CreditCardIcon />
                  Faturamento
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  Notificações
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOutIcon />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {session && session.profile && (
        <UserProfileDialog
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          user={{
            id: session.profile.id,
            email: session.profile.email || '',
            name: session.profile.name,
          }}
          profile={session.profile}
        />
      )}
    </>
  );
}
