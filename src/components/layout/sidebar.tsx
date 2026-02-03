import { Header } from './header';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-white px-[40px] pt-[40px] lg:w-(--sidebar-width)">
      <Header />
      <div className="-mr-1 scrollbar-hidden flex-1 overflow-y-auto pr-1">{children}</div>
    </aside>
  );
}
