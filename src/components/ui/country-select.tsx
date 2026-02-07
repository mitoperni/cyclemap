'use client';

import { useState, useMemo } from 'react';
import { Popover } from 'radix-ui';
import { MapPin, Search } from 'lucide-react';
import { cn, getCountryName } from '@/lib/utils';

export interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  countries: string[];
  placeholder?: string;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  countries,
  placeholder = 'Country',
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)));
  }, [countries]);

  const filteredCountries = useMemo(() => {
    if (!search) return sortedCountries;
    const searchLower = search.toLowerCase();
    return sortedCountries.filter((code) => {
      const name = getCountryName(code);
      return name.toLowerCase().includes(searchLower) || code.toLowerCase().includes(searchLower);
    });
  }, [sortedCountries, search]);

  const handleSelect = (country: string) => {
    onChange(country);
    setOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
    setSearch('');
  };

  const displayValue = value ? getCountryName(value) : placeholder;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-12 w-[114px] items-center justify-between rounded-full border border-torea-bay-200 bg-white px-4 text-base text-torea-bay-800',
            'transition-colors hover:bg-torea-bay-50 focus:outline-none focus:ring-2 focus:ring-torea-bay-800 focus:ring-offset-1',
            open && 'border-torea-bay-400 bg-torea-bay-50 ring-2 ring-torea-bay-800 ring-offset-1',
            className
          )}
          aria-label="Select country"
        >
          <MapPin className="h-4 w-4 shrink-0 text-torea-bay-800" />
          <span className={cn('truncate', !value && 'text-torea-bay-800')}>{displayValue}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 box-content w-[200px] rounded-lg border border-torea-bay-200 bg-white shadow-lg"
          sideOffset={8}
          align="end"
        >
          {/* Search input */}
          <div className="border-b border-zinc-400 p-2">
            <div className="flex items-center gap-2 px-2">
              <Search className="h-4 w-4 shrink-0 text-torea-bay-950 opacity-50" />
              <input
                type="text"
                placeholder="Search country"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search countries by name"
                className="w-full bg-transparent text-base text-torea-bay-800 placeholder:text-torea-bay-800 placeholder:opacity-50 focus:outline-none"
              />
            </div>
          </div>

          {/* Country list */}
          <div
            role="listbox"
            aria-label="Countries"
            className="max-h-[200px] overflow-y-auto px-1 py-[6px]"
          >
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-2 py-[6px] text-left text-sm font-normal leading-5 text-torea-bay-950 hover:bg-torea-bay-50"
              >
                All countries
              </button>
            )}
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-2 text-sm font-normal leading-5 text-torea-bay-950 opacity-50">
                No countries found
              </div>
            ) : (
              filteredCountries.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  tabIndex={0}
                  role="option"
                  aria-selected={value === code}
                  className={cn(
                    'w-full px-2 py-3 text-left text-sm font-normal leading-5 text-torea-bay-950 hover:bg-torea-bay-100 focus:bg-torea-bay-100 focus:outline-none',
                    value === code && 'bg-torea-bay-50 !font-medium'
                  )}
                >
                  {getCountryName(code)}
                </button>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
