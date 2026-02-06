'use client';

import { useState, useCallback, useEffect } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= BREAKPOINTS.XL);
    };

    checkScreenSize();
    // Pequeño delay para evitar animación en el render inicial
    requestAnimationFrame(() => {
      setHasMounted(true);
    });
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // En desktop siempre visible, en mobile depende de isOpen
  const shouldShowSidebar = isLargeScreen || isOpen;

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    isLargeScreen,
    shouldShowSidebar,
    hasMounted,
    toggle,
    open,
    close,
  };
}
