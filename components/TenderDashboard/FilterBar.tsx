"use client";

import React, { useState } from "react";
import { FilterDropdown } from "./FilterDropdown";
import { CountryFilter } from "./CountryFilter";
import { DateRangePicker } from "./DateRangePicker/DateRangePicker";

const priceRanges = [
  "140,000 - 500,000",
  "500,000 - 1,000,000",
  "1,000,000 - 3,000,000",
  "3,000,000+"
];

export const FilterBar: React.FC = () => {
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({ startDate, endDate });
    setIsDatePickerOpen(false);
  };

  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return "Select dates";
    }
    return `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`;
  };

  const handleClearAll = () => {
    setSelectedPrice(null);
    setDateRange({ startDate: null, endDate: null });
    // Add other clear actions as needed
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-4 items-center mt-6 w-full text-base text-zinc-800 max-md:max-w-full">
        <FilterDropdown 
          label="Contract Value (€)"
          options={priceRanges}
          onSelect={setSelectedPrice}
        />
        <CountryFilter />
        <div 
          onClick={() => setIsDatePickerOpen(true)}
          className="cursor-pointer"
        >
          <FilterDropdown 
            label={formatDateRange()} 
            options={[]}
          />
        </div>
        <button 
          onClick={handleClearAll}
          className="flex gap-2 justify-center items-center self-stretch px-4 py-2.5 my-auto text-center text-indigo-700 rounded-lg border border-indigo-700 border-solid"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/5ab9572b51dc72075900fbd0f0370f1fd47631ee794ad7744d3ccb423b018480?apiKey=27ce83af570848e9b22665bc31a03bc0&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
          />
          <span className="self-stretch my-auto">Clear All</span>
        </button>
      </div>

      {isDatePickerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
            onClick={() => setIsDatePickerOpen(false)}
          />
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </>
      )}
    </div>
  );
};
