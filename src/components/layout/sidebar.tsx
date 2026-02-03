import { Header } from './header';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-white lg:w-(--sidebar-width) ps-[40px] pt-[40px]">
      <Header />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
}
