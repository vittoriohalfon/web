import React from "react";
import { FilterDropdown } from "./FilterDropdown";
import { CountryFilter } from "./CountryFilter";

export const FilterBar: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center mt-6 w-full text-base text-zinc-800 max-md:max-w-full">
      <FilterDropdown label="1.000€ - 20.000€" />
      <CountryFilter />
      <FilterDropdown label="Nov 7th, 2024 - Nov 17th, 2024" />
      <button className="flex gap-2 justify-center items-center self-stretch px-4 py-2.5 my-auto text-center text-indigo-700 rounded-lg border border-indigo-700 border-solid">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/5ab9572b51dc72075900fbd0f0370f1fd47631ee794ad7744d3ccb423b018480?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt=""
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
        />
        <span className="self-stretch my-auto">Clear All</span>
      </button>
    </div>
  );
};
