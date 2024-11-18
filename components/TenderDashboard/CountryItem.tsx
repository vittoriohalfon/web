import React from "react";

interface CountryItemProps {
  country: string;
  isSelected: boolean;
  onToggle: () => void;
  flag?: string;
}

export const CountryItem: React.FC<CountryItemProps> = ({ 
  country, 
  isSelected, 
  onToggle,
  flag 
}) => {
  return (
    <li className="flex z-0 gap-2 items-center px-4 py-2.5 w-full hover:bg-gray-50 cursor-pointer"
        onClick={onToggle}
        role="option"
        aria-selected={isSelected}>
      <div className="flex justify-center items-center self-stretch my-auto w-5 min-h-[20px]">
        <div
          className={`flex self-stretch my-auto w-4 h-4 rounded border border-solid border-stone-300 min-h-[16px] ${
            isSelected ? "bg-indigo-600" : "bg-white"
          }`}
        />
      </div>
      <div className="flex gap-2 items-center flex-1">
        {flag && (
          <img
            src={flag}
            alt={`${country} flag`}
            className="object-contain w-[18px] aspect-[1.29]"
          />
        )}
        <span className="text-base text-neutral-950">{country}</span>
      </div>
    </li>
  );
}; 