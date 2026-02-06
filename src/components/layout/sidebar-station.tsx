'use client';

import { SidebarCloseButton } from './sidebar-toggle-button';
import { useSidebarContext } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children: React.ReactNode;
}

export const STATIONS_SCROLL_CONTAINER_ID = 'stations-scroll-container';

export function SidebarStation({ children }: SidebarProps) {
  const { shouldShowSidebar, isLargeScreen, hasMounted } = useSidebarContext();

  return (
    <aside
      id="sidebar"
      role="complementary"
      aria-label="Panel de estaciones"
      className={cn(
        'flex flex-col bg-torea-bay-800',
        // Solo animar después del mount inicial para evitar flash
        hasMounted && 'transition-all duration-300 ease-in-out',
        // Desktop: siempre visible, ancho fijo
        'lg:h-full lg:w-(--sidebar-width) lg:translate-x-0 lg:opacity-100',
        // Mobile: fullscreen overlay con animación slide + fade
        !isLargeScreen && 'fixed inset-0 z-50 h-screen w-full overflow-y-auto',
        !isLargeScreen && shouldShowSidebar && 'translate-x-0 opacity-100',
        !isLargeScreen && !shouldShowSidebar && '-translate-x-full opacity-0 pointer-events-none'
      )}
    >
      {/* Close button - solo visible en mobile cuando está abierto */}
      <SidebarCloseButton className="absolute right-4 top-4 z-10" variant="dark" />

      <div
        id={STATIONS_SCROLL_CONTAINER_ID}
        className="-mr-1 scrollbar-hidden flex-1 overflow-y-auto pr-1"
      >
        {children}
      </div>
    </aside>
  );
}
