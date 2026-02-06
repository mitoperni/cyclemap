'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterNetworks } from '@/lib/api/networks';
import { paginateItems, parsePageParam, sortNetworksByDistance } from '@/lib/utils';
import { useGeolocationContext } from './geolocation-context';
import type { Network, PaginationInfo } from '@/types';

interface FilteredNetworksContextValue {
  networks: Network[];
  filteredNetworks: Network[];
  paginatedNetworks: Network[];
  pagination: PaginationInfo;
  searchValue: string;
  countryValue: string;
  currentPage: number;
}

const FilteredNetworksContext = createContext<FilteredNetworksContextValue | null>(null);

interface FilteredNetworksProviderProps {
  networks: Network[];
  children: ReactNode;
}

export function FilteredNetworksProvider({ networks, children }: FilteredNetworksProviderProps) {
  const searchParams = useSearchParams();
  const { position: userPosition } = useGeolocationContext();

  const searchValue = searchParams.get('search') || '';
  const countryValue = searchParams.get('country') || '';
  const currentPage = parsePageParam(searchParams.get('page'));

  const filteredNetworks = useMemo(() => {
    let result = networks;

    if (countryValue || searchValue) {
      result = filterNetworks(result, {
        country: countryValue || undefined,
        search: searchValue || undefined,
      });
    }

    if (userPosition && !countryValue && !searchValue) {
      result = sortNetworksByDistance(result, userPosition.latitude, userPosition.longitude);
    }

    return result;
  }, [networks, countryValue, searchValue, userPosition]);

  const { items: paginatedNetworks, pagination } = useMemo(() => {
    return paginateItems(filteredNetworks, currentPage);
  }, [filteredNetworks, currentPage]);

  const value = useMemo(
    () => ({
      networks,
      filteredNetworks,
      paginatedNetworks,
      pagination,
      searchValue,
      countryValue,
      currentPage,
    }),
    [
      networks,
      filteredNetworks,
      paginatedNetworks,
      pagination,
      searchValue,
      countryValue,
      currentPage,
    ]
  );

  return (
    <FilteredNetworksContext.Provider value={value}>{children}</FilteredNetworksContext.Provider>
  );
}

export function useFilteredNetworks(): FilteredNetworksContextValue {
  const context = useContext(FilteredNetworksContext);

  if (!context) {
    throw new Error('useFilteredNetworks must be used within a FilteredNetworksProvider');
  }

  return context;
}
