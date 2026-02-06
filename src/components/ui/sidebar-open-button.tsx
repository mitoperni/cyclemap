'use client';

import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/contexts/sidebar-context';
import { SidebarToggleButtonProps } from '@/types';

export function SidebarOpenButton({ className, variant = 'light' }: SidebarToggleButtonProps) {
  const { open, isLargeScreen, isOpen } = useSidebarContext();

  if (isLargeScreen || isOpen) return null;

  return (
    <button
      onClick={open}
      className={cn(
        'flex px-4 py-2 items-center justify-center rounded-full shadow-lg cursor-pointer',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'light'
          ? 'bg-torea-bay-200 text-torea-bay-950  hover:bg-torea-bay-950 hover:text-torea-bay-200 focus:ring-torea-bay-400'
          : 'bg-torea-bay-800 text-white hover:bg-torea-bay-950 focus:ring-grenadier-400',
        className
      )}
      aria-label="Open sidebar menu"
      aria-expanded="false"
      aria-controls="sidebar"
    >
      <Menu className="h-5 w-5" />
      <span className="ml-2">{variant === 'light' ? 'Choose a network' : 'Choose a station'}</span>
    </button>
  );
}
