'use client';

import { Header } from './header';
import { useSidebarContext } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import { SidebarCloseButton } from '../ui/sidebar-close-button';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { shouldShowSidebar, isLargeScreen, hasMounted } = useSidebarContext();

  return (
    <aside
      id="sidebar"
      role="complementary"
      aria-label="Bike networks panel"
      className={cn(
        'flex flex-col bg-white',
        hasMounted && 'transition-all duration-300 ease-in-out',
        'xl:h-full xl:w-(--sidebar-width) xl:px-[40px] xl:pt-[40px] xl:translate-x-0 xl:opacity-100',
        !isLargeScreen && 'fixed inset-0 z-50 h-screen w-full overflow-y-auto px-[40px] pt-[40px]',
        !isLargeScreen && shouldShowSidebar && 'translate-x-0 opacity-100',
        !isLargeScreen && !shouldShowSidebar && '-translate-x-full opacity-0 pointer-events-none'
      )}
    >
      <SidebarCloseButton className="absolute right-4 top-4" variant="light" />

      <Header />
      <div className="-mr-1 flex-1 overflow-y-auto pr-1">{children}</div>
    </aside>
  );
}
