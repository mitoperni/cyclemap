import { memo } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import { formatCompanies, getCountryName } from '@/lib/utils';
import type { Network } from '@/types';

interface NetworkCardProps {
  network: Network;
}

export const NetworkCard = memo(function NetworkCard({ network }: NetworkCardProps) {
  const { id, name, location, company } = network;
  const { text: companiesText, remainingCount } = formatCompanies(company);

  return (
    <Link
      href={`/network/${id}`}
      className="group flex items-center justify-between border-b border-gray-100 py-4 px-6 transition-colors hover:bg-torea-bay-100"
    >
      <div className="flex flex-1 flex-col">
        {/* Network Name */}
        <h3 className="text-xl font-bold leading-7 text-torea-bay-800 mb-1">{name}</h3>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-[8px]">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <div className="flex items-center justify-center h-6 w-6 bg-torea-bay-50 rounded-[4px]">
                <MapPin className="h-4 w-4 text-grenadier-400" />
              </div>
              <span className="leading-7 text-muted-foreground">
                {location.city}, {getCountryName(location.country)}
              </span>
            </div>

            {/* Companies */}
            {company.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex items-center justify-center h-6 w-6 bg-torea-bay-50 rounded-[4px]">
                  <Building2 className="h-4 w-4 text-grenadier-400" />
                </div>
                <span className="max-w-[180px] truncate leading-7 text-muted-foreground">
                  {companiesText}
                </span>
                {remainingCount > 0 && (
                  <span className="shrink-0 rounded border border-grenadier-400 px-1.5 py-0.5 text-xs text-grenadier-500">
                    +{remainingCount}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Arrow expands to Details pill on hover */}
          <div className="flex items-center justify-end overflow-hidden rounded-full bg-transparent px-0 py-0 text-grenadier-500 transition-all duration-300 group-hover:bg-white group-hover:px-4 group-hover:py-2 group-hover:shadow-sm">
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-[80px] group-hover:opacity-100 group-hover:mr-2">
              Details
            </span>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
});
