'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { MapPin, Search } from 'lucide-react';
import { cn, getCountryName } from '@/lib/utils';
import { COUNTRY_SELECT } from '@/lib/constants';

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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = useCallback(
    (country: string) => {
      onChange(country);
      setOpen(false);
      setSearch('');
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
    setOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
  }, [onChange]);

  // highlightedIndex: -1 = nothing, CLEAR_INDEX (-2) = "All countries", 0+ = country option
  const { CLEAR_INDEX } = COUNTRY_SELECT;
  const hasClearOption = !!value;

  // Scroll highlighted option into view
  useEffect(() => {
    if (!scrollContainerRef.current || highlightedIndex === -1) return;
    const selector =
      highlightedIndex === CLEAR_INDEX
        ? '[data-clear-option]'
        : `[data-index="${highlightedIndex}"]`;
    const option = scrollContainerRef.current.querySelector(selector);
    if (option) {
      option.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, CLEAR_INDEX]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const optionCount = filteredCountries.length;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            if (prev === CLEAR_INDEX) return 0;
            if (prev < optionCount - 1) return prev + 1;
            return hasClearOption ? CLEAR_INDEX : 0;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            if (prev === CLEAR_INDEX) return optionCount - 1;
            if (prev > 0) return prev - 1;
            return hasClearOption ? CLEAR_INDEX : optionCount - 1;
          });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (highlightedIndex === CLEAR_INDEX) {
            handleClear();
          } else if (highlightedIndex >= 0 && highlightedIndex < optionCount) {
            handleSelect(filteredCountries[highlightedIndex]);
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          setHighlightedIndex(hasClearOption ? CLEAR_INDEX : 0);
          break;
        }
        case 'End': {
          e.preventDefault();
          setHighlightedIndex(optionCount - 1);
          break;
        }
      }
    },
    [filteredCountries, highlightedIndex, handleSelect, handleClear, hasClearOption, CLEAR_INDEX]
  );

  const highlightedId =
    highlightedIndex >= 0 && highlightedIndex < filteredCountries.length
      ? `country-option-${filteredCountries[highlightedIndex]}`
      : undefined;

  const displayValue = value ? getCountryName(value) : placeholder;

  return (
    <Popover.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearch('');
          setHighlightedIndex(-1);
        }
      }}
    >
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
          className="z-50 box-border w-[200px] rounded-lg border border-torea-bay-200 bg-white shadow-lg"
          sideOffset={8}
          align="end"
        >
          {/* Combobox search input */}
          <div className="border-b border-zinc-400">
            <div className="flex items-center gap-2 px-2 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-torea-bay-950 opacity-50" />
              <input
                type="text"
                id="country-search-input"
                name="country-search"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="country-listbox"
                aria-expanded={open}
                aria-activedescendant={highlightedId}
                aria-label="Search countries by name"
                placeholder="Search country"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-base leading-5 text-torea-bay-800 placeholder:text-torea-bay-800 placeholder:opacity-50 focus:outline-none"
              />
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="max-h-[172px] overflow-y-auto px-1 py-1.5"
            onMouseLeave={() => setHighlightedIndex(-1)}
          >
            {/* Clear selection */}
            {value && (
              <div className="border-b border-torea-bay-200">
                <button
                  type="button"
                  data-clear-option
                  onClick={handleClear}
                  onMouseEnter={() => setHighlightedIndex(CLEAR_INDEX)}
                  className={cn(
                    'w-full px-2 py-2.5 text-left text-sm font-normal leading-5 text-torea-bay-950 focus:outline-none',
                    highlightedIndex === CLEAR_INDEX ? 'bg-torea-bay-100' : 'hover:bg-torea-bay-100'
                  )}
                >
                  All countries
                </button>
              </div>
            )}

            {/* Country listbox */}
            <div id="country-listbox" role="listbox" aria-label="Countries">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-2 text-sm font-normal leading-5 text-torea-bay-950 opacity-50">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((code, index) => (
                  <div
                    key={code}
                    id={`country-option-${code}`}
                    role="option"
                    data-index={index}
                    aria-selected={value === code}
                    onClick={() => handleSelect(code)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full cursor-pointer px-2 py-1.5 text-left text-sm font-normal leading-5 text-torea-bay-950',
                      index === highlightedIndex && 'bg-torea-bay-100',
                      value === code && index !== highlightedIndex && 'bg-torea-bay-50',
                      value === code && '!font-medium'
                    )}
                  >
                    {getCountryName(code)}
                  </div>
                ))
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
