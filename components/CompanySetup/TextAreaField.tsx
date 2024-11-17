import React from "react";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col mt-4 w-full max-md:max-w-full">
      <label className="text-sm font-medium text-neutral-950 max-md:max-w-full">
        {label}
      </label>
      <div className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base leading-6 bg-white rounded-lg border border-solid border-zinc-300 text-neutral-500 max-md:max-w-full">
        <textarea
          placeholder={placeholder}
          className="w-full text-base resize-y border-none min-h-[72px] text-neutral-950 focus:outline-none focus:border-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
      </div>
    </div>
  );
};
