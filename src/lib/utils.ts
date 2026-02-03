import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Network } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUniqueCountries(networks: Network[]): string[] {
  return Array.from(new Set(networks.map((n) => n.location.country))).sort();
}
