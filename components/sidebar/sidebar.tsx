import React from 'react';
import {
  Cog,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Plus,
  SendIcon,
  Shield,
} from 'lucide-react';
import { SCREENS, ACTIONS } from '@/configs/permissions';

export const sidebarData = {
  quickActions: [
    {
      title: 'Novo Atendimento SEEU',
      url: '/seeu-service/create',
      icon: <Plus />,
      screen: SCREENS.SEEU_SERVICE,
      action: ACTIONS.CREATE,
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'SEEU',
      url: '/seeu-service',
      icon: <Cog />,
      screen: SCREENS.SEEU_SERVICE,
      action: ACTIONS.VIEW,
    },
    {
      title: 'Administrador',
      icon: <Shield />,
      items: [
        {
          title: 'Usuários',
          url: '/admin/users',
          screen: SCREENS.USERS,
          action: ACTIONS.VIEW,
        },
        {
          title: 'Cargos',
          url: '/admin/positions',
          screen: SCREENS.POSITIONS,
          action: ACTIONS.VIEW,
        },
        {
          title: 'Departamentos',
          url: '/admin/departments',
          screen: SCREENS.DEPARTMENTS,
          action: ACTIONS.VIEW,
        },
        {
          title: 'Telas',
          url: '/admin/screens',
          screen: SCREENS.SCREENS,
          action: ACTIONS.VIEW,
        },
        {
          title: 'Permissões',
          url: '/admin/permissions',
          screen: SCREENS.PERMISSIONS,
          action: ACTIONS.VIEW,
        },
        {
          title: 'Logs do Sistema',
          url: '/admin/logs',
          screen: SCREENS.AUDIT_LOGS,
          action: ACTIONS.VIEW,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: <LifeBuoyIcon />,
    },
    {
      title: 'Debug',
      url: '/debug-perms',
      icon: <SendIcon />,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: <SendIcon />,
    },
  ],
};
