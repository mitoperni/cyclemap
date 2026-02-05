'use client';

import { NetworkFilters } from './network-filters';
import { NetworkList } from './network-list';
import { NetworksIntro } from './networks-intro';
import { Pagination } from '@/components/ui/pagination';
import { useFilteredNetworks } from '@/contexts';
import { useUrlParams } from '@/hooks/use-url-params';

interface NetworkSidebarProps {
  countries: string[];
}

export function NetworkSidebar({ countries }: NetworkSidebarProps) {
  const { paginatedNetworks, pagination } = useFilteredNetworks();
  const { setPage } = useUrlParams();

  return (
    <div className="flex flex-col gap-6">
      <div id="network-list-top">
        <NetworksIntro />
      </div>
      <NetworkFilters countries={countries} />
      <NetworkList networks={paginatedNetworks} />
      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          className="px-4 pb-6"
          scrollTargetId="network-list-top"
        />
      )}
    </div>
  );
}
