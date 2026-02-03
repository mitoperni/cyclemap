'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { NetworkFilters } from './network-filters';
import { NetworkList } from './network-list';
import { NetworksIntro } from './networks-intro';
import { filterNetworks } from '@/lib/api/networks';
import type { Network } from '@/types';

interface NetworkSidebarProps {
  networks: Network[];
  countries: string[];
}

export function NetworkSidebar({ networks, countries }: NetworkSidebarProps) {
  const searchParams = useSearchParams();

  // Get current values from URL
  const searchValue = searchParams.get('search') || '';
  const countryValue = searchParams.get('country') || '';

  // Filter networks locally with useMemo
  const filteredNetworks = useMemo(() => {
    return filterNetworks(networks, {
      search: searchValue || undefined,
      country: countryValue || undefined,
    });
  }, [networks, searchValue, countryValue]);

  return (
    <div className="flex flex-col gap-6">
      <NetworksIntro />
      <NetworkFilters countries={countries} />
      <NetworkList networks={filteredNetworks} />
    </div>
  );
}
