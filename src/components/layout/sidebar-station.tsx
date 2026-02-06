'use client';

import { useSidebarContext } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import { SidebarCloseButton } from '../ui/sidebar-close-button';

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
        hasMounted && 'transition-all duration-300 ease-in-out',
        'xl:h-full xl:w-(--sidebar-width) xl:translate-x-0 xl:opacity-100',
        !isLargeScreen && 'fixed inset-0 z-50 h-screen w-full overflow-y-auto',
        !isLargeScreen && shouldShowSidebar && 'translate-x-0 opacity-100',
        !isLargeScreen && !shouldShowSidebar && '-translate-x-full opacity-0 pointer-events-none'
      )}
    >
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
