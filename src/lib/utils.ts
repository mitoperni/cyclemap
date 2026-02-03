import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Network } from '@/types';
import countriesData from '@/data/countries.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const countryMap = new Map(countriesData.data.map((c) => [c.code, c.name]));
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function getCountryName(code: string): string {
  const fromJson = countryMap.get(code);
  if (fromJson) return fromJson;

  try {
    return displayNames.of(code) || code;
  } catch {
    return code;
  }
}

export function getUniqueCountries(networks: Network[]): string[] {
  return Array.from(new Set(networks.map((n) => n.location.country))).sort();
}
