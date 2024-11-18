"use client";

import React, { useState, useRef, useEffect } from "react";
import { CountryItem } from "./CountryItem";

interface Country {
  name: string;
  code: string;
  flag?: string;
}

const countries: Country[] = [
  {
    name: "France",
    code: "FR",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/bf8d64f9d62611dbd1335e6efcc698b3398adf7b47fee8eec835a0f6e898f275?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Ireland",
    code: "IE",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Germany",
    code: "DE",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Italy",
    code: "IT",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Spain",
    code: "ES",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Netherlands",
    code: "NL",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Belgium",
    code: "BE",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Poland",
    code: "PL",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Portugal",
    code: "PT",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Romania",
    code: "RO",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Austria",
    code: "AT",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Sweden",
    code: "SE",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Finland",
    code: "FI",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Denmark",
    code: "DK",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Czech Republic",
    code: "CZ",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Greece",
    code: "GR",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Bulgaria",
    code: "BG",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Croatia",
    code: "HR",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Slovakia",
    code: "SK",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Lithuania",
    code: "LT",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Latvia",
    code: "LV",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Estonia",
    code: "EE",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Cyprus",
    code: "CY",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Hungary",
    code: "HU",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Slovenia",
    code: "SI",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Luxembourg",
    code: "LU",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Malta",
    code: "MT",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
];

export const CountryFilter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleCountry = (countryName: string) => {
    const newSet = new Set(selectedCountries);
    if (newSet.has(countryName)) {
      newSet.delete(countryName);
    } else {
      newSet.add(countryName);
    }
    setSelectedCountries(newSet);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountryList = Array.from(selectedCountries);
  const displayedCountries = selectedCountryList.slice(0, 2);
  const remainingCount = selectedCountryList.length - displayedCountries.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex overflow-hidden flex-1 shrink justify-between items-center self-stretch px-2 py-2.5 my-auto text-xs font-medium leading-none whitespace-nowrap bg-gray-50 rounded-lg border border-solid shadow-sm basis-4 border-zinc-300 min-h-[44px] min-w-[240px] cursor-pointer"
      >
        <div className="flex flex-1 shrink gap-4 items-center self-stretch my-auto w-full basis-0 min-w-[240px]">
          {selectedCountries.size === 0 ? (
            <span className="font-sora text-base">Country</span>
          ) : (
            <div className="flex gap-2 items-center self-stretch my-auto">
              {displayedCountries.map((countryName) => {
                const country = countries.find(c => c.name === countryName);
                return country ? (
                  <div
                    key={country.code}
                    className="flex gap-2 items-center self-stretch px-2 py-1 my-auto rounded border border-solid border-zinc-300 min-h-[26px]"
                  >
                    <img
                      loading="lazy"
                      src={country.flag}
                      alt={`${country.name} flag`}
                      className="object-contain shrink-0 self-stretch my-auto aspect-[1.29] w-[18px]"
                    />
                    <div className="self-stretch my-auto">{country.name}</div>
                  </div>
                ) : null;
              })}
              {remainingCount > 0 && (
                <div className="gap-2 self-stretch px-2 py-1 my-auto rounded border border-solid border-zinc-300 min-h-[26px]">
                  +{remainingCount}
                </div>
              )}
            </div>
          )}
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/f0e2860dee9b77a0397dc8a6597a1bb04321b555a68b4d23f6f04d0035c32d64?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt=""
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto">
          <ul className="list-none p-0 m-0" role="listbox">
            {countries.map((country) => (
              <CountryItem
                key={country.code}
                country={country.name}
                flag={country.flag}
                isSelected={selectedCountries.has(country.name)}
                onToggle={() => toggleCountry(country.name)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
