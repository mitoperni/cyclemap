'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/contexts/sidebar-context';
import { SidebarToggleButtonProps } from '@/types';

export function SidebarCloseButton({ className, variant = 'light' }: SidebarToggleButtonProps) {
  const { close, isLargeScreen, isOpen } = useSidebarContext();

  // Solo mostrar en mobile cuando el sidebar está abierto
  if (isLargeScreen || !isOpen) return null;

  return (
    <button
      onClick={close}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full shadow-lg cursor-pointer',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'light'
          ? 'bg-torea-bay-800 text-white hover:bg-torea-bay-950 focus:ring-torea-bay-400'
          : 'bg-torea-bay-300 text-torea-bay-950 hover:bg-torea-bay-50 focus:ring-grenadier-400',
        className
      )}
      aria-label="Cerrar menú lateral"
      aria-expanded="true"
      aria-controls="sidebar"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
