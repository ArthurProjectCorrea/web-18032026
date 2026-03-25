'use client';

import { create } from 'zustand';
import { getCookie, UserSession } from '@/lib/auth';
import { parseSession } from '@/lib/permissions';

interface SessionState {
  session: UserSession | null;
  isLoading: boolean;
  refresh: () => void;
  setSession: (session: UserSession | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isLoading: true,
  refresh: () => {
    const sessionData = parseSession(getCookie('session'));
    set({ session: sessionData, isLoading: false });
  },
  setSession: (session) => set({ session, isLoading: false }),
}));

// Inicialização segura no client-side
if (typeof window !== 'undefined') {
  useSessionStore.getState().refresh();
}
