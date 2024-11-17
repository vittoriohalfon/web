import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
      <label className="text-sm font-medium text-neutral-950">{label}</label>
      <div className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full text-base border-none text-neutral-950 focus:outline-none focus:border-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
      </div>
    </div>
  );
};
