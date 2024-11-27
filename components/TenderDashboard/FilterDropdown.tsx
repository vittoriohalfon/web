"use client";

import React, { useState } from "react";
interface FilterDropdownProps {
  label: string;
  options: string[];
  onSelect?: (value: string | null) => void;
  selected?: string | null;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options = [],
  onSelect,
  selected = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(selected);

  const handleSelect = (value: string) => {
    setSelectedPrice(value);
    onSelect?.(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex overflow-hidden flex-1 shrink justify-between items-center self-stretch px-2 py-2.5 my-auto bg-gray-50 rounded-lg border border-solid shadow-sm basis-4 border-zinc-300 min-h-[44px] min-w-[240px] cursor-pointer`}
      >
        <div className="flex-1 shrink self-stretch my-auto basis-0">
          {selectedPrice || label}
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/77efb852bd310dd2e51488b5aa132f4cd1c035b624689b4c19b8e86af0a00fdf?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt=""
          className={`object-contain shrink-0 self-stretch my-auto w-5 aspect-square transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
