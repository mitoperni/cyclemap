'use client';

import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/contexts/sidebar-context';

interface SidebarToggleButtonProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function SidebarOpenButton({ className, variant = 'light' }: SidebarToggleButtonProps) {
  const { open, isLargeScreen, isOpen } = useSidebarContext();

  // Solo mostrar en mobile cuando el sidebar está cerrado
  if (isLargeScreen || isOpen) return null;

  return (
    <button
      onClick={open}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full shadow-lg',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'light'
          ? 'bg-white text-torea-bay-800 hover:bg-gray-100 focus:ring-torea-bay-400'
          : 'bg-torea-bay-800 text-white hover:bg-torea-bay-900 focus:ring-grenadier-400',
        className
      )}
      aria-label="Abrir menú lateral"
      aria-expanded="false"
      aria-controls="sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export function SidebarCloseButton({ className, variant = 'light' }: SidebarToggleButtonProps) {
  const { close, isLargeScreen, isOpen } = useSidebarContext();

  // Solo mostrar en mobile cuando el sidebar está abierto
  if (isLargeScreen || !isOpen) return null;

  return (
    <button
      onClick={close}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full shadow-lg',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'light'
          ? 'bg-gray-100 text-torea-bay-800 hover:bg-gray-200 focus:ring-torea-bay-400'
          : 'bg-torea-bay-700 text-white hover:bg-torea-bay-600 focus:ring-grenadier-400',
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
