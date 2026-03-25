'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

interface UserAvatarCardProps {
  user: {
    name: string;
    avatar_url: string | null;
    position: {
      name: string;
      department: {
        name: string;
      } | null;
    } | null;
  };
  className?: string;
  avatarClassName?: string;
  showName?: boolean;
}

export function UserAvatarCard({
  user,
  className,
  avatarClassName,
  showName = false,
}: UserAvatarCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            'flex cursor-help items-center gap-2 transition-opacity hover:opacity-80',
            className
          )}
        >
          <Avatar
            className={cn(
              'h-7 w-7 border shadow-xs transition-transform group-hover:scale-105',
              avatarClassName
            )}
          >
            <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-extrabold tracking-tighter">
              {initials}
            </AvatarFallback>
          </Avatar>
          {showName && (
            <span className="text-foreground/90 max-w-[120px] truncate text-sm font-medium">
              {user.name}
            </span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="border-muted/40 w-72 overflow-hidden rounded-xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]"
        align="start"
        sideOffset={8}
      >
        <div className="flex items-start gap-3.5">
          <Avatar className="border-background h-14 w-14 shrink-0 border-2 shadow-md">
            <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 pt-0.5">
            <h4 className="mb-1 truncate text-sm leading-tight font-bold text-slate-900 dark:text-slate-100">
              {user.name}
            </h4>
            <div className="space-y-1">
              <p className="truncate text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {user.position?.name || 'Sem cargo'}
              </p>
              {user.position?.department?.name && (
                <p className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span className="truncate">
                    {user.position.department.name}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
