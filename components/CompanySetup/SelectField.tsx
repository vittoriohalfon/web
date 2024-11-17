import React from "react";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div className="flex flex-col mt-4 w-full max-md:max-w-full">
      <label className="text-sm font-medium text-neutral-950 max-md:max-w-full">
        {label}
      </label>
      <div className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300 text-neutral-500 max-md:max-w-full">
        <select
          className="w-full text-base rounded-lg border-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{ color: value ? "#0B0B0B" : "#7C7C7C" }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
