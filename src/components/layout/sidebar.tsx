'use client';

import { Header } from './header';
import { useSidebarContext } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import { SidebarCloseButton } from '../ui/sidebar-close-button';
import { SIDEBAR_VARIANT_CONFIG } from '@/lib/constants';

interface SidebarProps {
  children: React.ReactNode;
  variant: 'networks' | 'stations';
}

export function Sidebar({ children, variant }: SidebarProps) {
  const { shouldShowSidebar, isLargeScreen, hasMounted } = useSidebarContext();
  const config = SIDEBAR_VARIANT_CONFIG[variant];

  return (
    <aside
      id="sidebar"
      role="complementary"
      aria-label={config.ariaLabel}
      className={cn(
        'flex flex-col',
        config.bg,
        hasMounted && 'transition-all duration-300 ease-in-out',
        'xl:h-full xl:w-(--sidebar-width) xl:translate-x-0 xl:opacity-100',
        config.xlPadding,
        !isLargeScreen && 'fixed inset-0 z-50 h-screen w-full overflow-y-auto',
        !isLargeScreen && config.mobilePadding,
        !isLargeScreen && shouldShowSidebar && 'translate-x-0 opacity-100',
        !isLargeScreen && !shouldShowSidebar && '-translate-x-full opacity-0 pointer-events-none'
      )}
    >
      <SidebarCloseButton className={config.closeButtonClass} variant={config.closeButtonVariant} />

      {config.showHeader && <Header />}
      <div id={config.scrollContainerId} className="-mr-1 flex-1 overflow-y-auto pr-1">
        {children}
      </div>
    </aside>
  );
}
