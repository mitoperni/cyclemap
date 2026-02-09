'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Building2 } from 'lucide-react';
import { formatCompanies, getCountryName } from '@/lib/utils';
import type { NetworkWithStations } from '@/types';

interface StationsHeaderProps {
  network: NetworkWithStations;
}

export function StationsHeader({ network }: StationsHeaderProps) {
  const router = useRouter();
  const { name, location, company } = network;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };
  const { text: companiesText, remainingCount } = formatCompanies(company);

  return (
    <div className="relative flex flex-col gap-6 px-10 py-8 min-h-[252px]">
      {/* Background image with gradient fade */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)),url('/stations_header.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-torea-bay-800 from-0% via-torea-bay-800/25 via-45% to-transparent to-100%" />
      </div>

      {/* Back button */}
      <button
        onClick={handleBack}
        className="relative z-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-grenadier-400 cursor-pointer"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <ArrowLeft className="h-5 w-5" />
        </div>
      </button>

      {/* Network info */}
      <div className="relative z-10 flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-white">{name}</h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-6 w-6 items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="text-white">
            {location.city}, {getCountryName(location.country)}
          </span>
        </div>

        {/* Companies */}
        {company.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-white">{companiesText}</span>
            {remainingCount > 0 && (
              <span className="shrink-0 rounded border border-white/50 px-1.5 py-0.5 text-xs text-white">
                +{remainingCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
