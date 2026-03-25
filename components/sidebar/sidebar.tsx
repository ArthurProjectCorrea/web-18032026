import React from 'react';
import {
  Cog,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Plus,
  SendIcon,
  Shield,
} from 'lucide-react';

export const sidebarData = {
  quickActions: [
    {
      title: 'Novo Atendimento SEEU',
      url: '/seeu-service/create',
      icon: <Plus />,
      screen: 'seeu_service',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: <LayoutDashboardIcon />,
    },
    // {
    //   title: 'SEEU',
    //   url: '/seeu-service',
    //   icon: <Cog />,
    //   screen: 'seeu_service',
    // },
    // {
    //   title: 'Cadastros',
    //   icon: <Plus />,
    //   items: [
    //     {
    //       title: 'Pessoas',
    //       url: '/register/people',
    //       screen: 'people',
    //     },
    //   ],
    // },
    {
      title: 'Administrador',
      icon: <Shield />,
      items: [
        {
          title: 'Usuários',
          url: '/admin/users',
          screen: 'users',
        },
        {
          title: 'Cargos',
          url: '/admin/positions',
          screen: 'positions',
        },
        {
          title: 'Departamentos',
          url: '/admin/departments',
          screen: 'departments',
        },
        // {
        //   title: 'Telas',
        //   url: '/admin/screens',
        //   screen: 'screens_manage',
        // },
        // {
        //   title: 'Permissões',
        //   url: '/admin/permissions',
        //   screen: 'permissions_manage',
        // },
        // {
        //   title: 'Logs do Sistema',
        //   url: '/admin/logs',
        //   screen: 'audit_logs',
        // },
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
      title: 'Feedback',
      url: '#',
      icon: <SendIcon />,
    },
  ],
};
