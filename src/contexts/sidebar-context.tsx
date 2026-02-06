'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';

interface SidebarContextValue {
  isOpen: boolean;
  isLargeScreen: boolean;
  shouldShowSidebar: boolean;
  hasMounted: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const sidebarState = useSidebar();
  return <SidebarContext.Provider value={sidebarState}>{children}</SidebarContext.Provider>;
}

const defaultSidebarState: SidebarContextValue = {
  isOpen: false,
  isLargeScreen: true,
  shouldShowSidebar: true,
  hasMounted: false,
  toggle: () => {},
  open: () => {},
  close: () => {},
};

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  return context ?? defaultSidebarState;
}
