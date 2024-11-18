"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
    flag: "/flags/france.svg",
  },
  {
    name: "Ireland",
    code: "IE",
    flag: "/flags/ireland.svg",
  },
  {
    name: "Germany",
    code: "DE",
    flag: "/flags/germany.svg",
  },
  {
    name: "Italy",
    code: "IT",
    flag: "/flags/italy.svg",
  },
  {
    name: "Spain",
    code: "ES",
    flag: "/flags/spain.svg",
  },
  {
    name: "Netherlands",
    code: "NL",
    flag: "/flags/netherlands.svg",
  },
  {
    name: "Belgium",
    code: "BE",
    flag: "/flags/belgium.svg",
  },
  {
    name: "Poland",
    code: "PL",
    flag: "/flags/poland.svg",
  },
  {
    name: "Portugal",
    code: "PT",
    flag: "/flags/portugal.svg",
  },
  {
    name: "Romania",
    code: "RO",
    flag: "/flags/romania.svg",
  },
  {
    name: "Austria",
    code: "AT",
    flag: "/flags/austria.svg",
  },
  {
    name: "Sweden",
    code: "SE",
    flag: "/flags/sweden.svg",
  },
  {
    name: "Finland",
    code: "FI",
    flag: "/flags/finland.svg",
  },
  {
    name: "Denmark",
    code: "DK",
    flag: "/flags/denmark.svg",
  },
  {
    name: "Czech Republic",
    code: "CZ",
    flag: "/flags/czech-republic.svg",
  },
  {
    name: "Greece",
    code: "GR",
    flag: "/flags/greece.svg",
  },
  {
    name: "Bulgaria",
    code: "BG",
    flag: "/flags/bulgaria.svg",
  },
  {
    name: "Croatia",
    code: "HR",
    flag: "/flags/croatia.svg",
  },
  {
    name: "Slovakia",
    code: "SK",
    flag: "/flags/slovakia.svg",
  },
  {
    name: "Lithuania",
    code: "LT",
    flag: "/flags/lithuania.svg",
  },
  {
    name: "Latvia",
    code: "LV",
    flag: "/flags/latvia.svg",
  },
  {
    name: "Estonia",
    code: "EE",
    flag: "/flags/estonia.svg",
  },
  {
    name: "Cyprus",
    code: "CY",
    flag: "/flags/cyprus.svg",
  },
  {
    name: "Hungary",
    code: "HU",
    flag: "/flags/hungary.svg",
  },
  {
    name: "Slovenia",
    code: "SI",
    flag: "/flags/slovenia.svg",
  },
  {
    name: "Luxembourg",
    code: "LU",
    flag: "/flags/luxembourg.svg",
  },
  {
    name: "Malta",
    code: "MT",
    flag: "/flags/malta.svg",
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
                    {country.flag?.startsWith('/') ? (
                      <Image
                        src={country.flag}
                        alt={`${country.name} flag`}
                        width={18}
                        height={14}
                        className="object-contain"
                      />
                    ) : (
                      <img
                        loading="lazy"
                        src={country.flag}
                        alt={`${country.name} flag`}
                        className="object-contain shrink-0 self-stretch my-auto aspect-[1.29] w-[18px]"
                      />
                    )}
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
