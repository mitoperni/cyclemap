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

export function cleanStationName(name: string): string {
  let cleaned = name.trim();

  // Remove leading numeric prefixes (e.g., "001 - Station Name")
  cleaned = cleaned.replace(/^\d+[\s\-\.]+\s*/, '');

  // Remove leading short code prefixes (e.g., "AUH - Marina Mall Signal")
  cleaned = cleaned.replace(/^[A-Z]{2,4}\s*-\s*/, '');

  // Remove leading underscores and convert ALL CAPS to Title Case
  if (cleaned.startsWith('_')) {
    cleaned = cleaned.replace(/^_+/, '');
    // Check if the remaining text is all uppercase
    if (cleaned === cleaned.toUpperCase() && /[A-Z]/.test(cleaned)) {
      cleaned = cleaned
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  return cleaned.trim();
}
