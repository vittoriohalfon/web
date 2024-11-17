import React from "react";

interface FilterDropdownProps {
  label: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ label }) => {
  return (
    <div className="flex overflow-hidden flex-1 shrink justify-between items-center self-stretch px-2 py-2.5 my-auto bg-gray-50 rounded-lg border border-solid shadow-sm basis-4 border-zinc-300 min-h-[44px] min-w-[240px]">
      <div className="flex-1 shrink self-stretch my-auto basis-0">{label}</div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/77efb852bd310dd2e51488b5aa132f4cd1c035b624689b4c19b8e86af0a00fdf?apiKey=27ce83af570848e9b22665bc31a03bc0&"
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
      />
    </div>
  );
};
