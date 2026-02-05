interface SidebarProps {
  children: React.ReactNode;
}

export const STATIONS_SCROLL_CONTAINER_ID = 'stations-scroll-container';

export function SidebarStation({ children }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-torea-bay-800 lg:w-(--sidebar-width)">
      <div
        id={STATIONS_SCROLL_CONTAINER_ID}
        className="-mr-1 scrollbar-hidden flex-1 overflow-y-auto pr-1"
      >
        {children}
      </div>
    </aside>
  );
}
