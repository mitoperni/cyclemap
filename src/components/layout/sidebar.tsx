import { Header } from './header';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-white px-[40px] pt-[40px] lg:w-(--sidebar-width)">
      <Header />
      <div className="scrollbar-hidden flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
}
