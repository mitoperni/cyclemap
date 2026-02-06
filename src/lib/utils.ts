import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Network, PaginatedResult, StationSort } from '@/types';
import countriesData from '@/data/countries.json';
import { PAGINATION } from './constants';

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

  // Remove leading alphanumeric prefixes (e.g., "001 - Station Name", "25A - Plaza de Celenque A")
  cleaned = cleaned.replace(/^[A-Z0-9]+[\s\-\.]+\s*/, '');

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

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      startIndex: totalItems > 0 ? startIndex + 1 : 0,
      endIndex,
    },
  };
}

export function parsePageParam(value: string | null): number {
  if (!value) return 1;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function getPaginationItems(currentPage: number, totalPages: number) {
  const items: (number | string)[] = [];

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
  } else {
    if (currentPage <= 2) {
      for (let i = 1; i <= 3; i++) {
        items.push(i);
      }
      items.push('...');
    } else if (currentPage >= totalPages - 2) {
      items.push('...');
      for (let i = totalPages - 2; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push('...');
      items.push(currentPage - 1);
      items.push(currentPage);
      items.push(currentPage + 1);
      items.push('...');
    }
  }

  return items;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get aria-sort attribute value for a sortable column header
 */
export function getAriaSort(
  columnSort: StationSort | null,
  field: StationSort['field']
): 'none' | 'ascending' | 'descending' {
  if (columnSort?.field !== field) return 'none';
  return columnSort.direction === 'asc' ? 'ascending' : 'descending';
}

/**
 * Sort networks by distance from a given position
 */
export function sortNetworksByDistance(
  networks: Network[],
  userLat: number,
  userLon: number
): Network[] {
  return [...networks].sort((a, b) => {
    const distA = calculateDistance(userLat, userLon, a.location.latitude, a.location.longitude);
    const distB = calculateDistance(userLat, userLon, b.location.latitude, b.location.longitude);
    return distA - distB;
  });
}
