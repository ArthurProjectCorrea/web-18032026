import { create } from 'zustand';

interface BreadcrumbState {
  overrides: Record<string, string>;
  setOverride: (path: string, label: string) => void;
  removeOverride: (path: string) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  overrides: {},
  setOverride: (path, label) =>
    set((state) => ({
      overrides: { ...state.overrides, [path.toLowerCase()]: label },
    })),
  removeOverride: (path) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [path.toLowerCase()]: _, ...rest } = state.overrides;
      return { overrides: rest };
    }),
}));
