'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setIsLargeScreen(window.innerWidth >= BREAKPOINTS.XL);
    });
    const rafId = requestAnimationFrame(() => {
      setHasMounted(true);
    });

    const handleResize = () => {
      if (resizeTimerRef.current !== null) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        setIsLargeScreen(window.innerWidth >= BREAKPOINTS.XL);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      if (resizeTimerRef.current !== null) clearTimeout(resizeTimerRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
