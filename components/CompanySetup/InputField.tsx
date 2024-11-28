import React from "react";

interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hideLabel?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hideLabel = false,
}) => {
  return (
    <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
      {!hideLabel && label && (
        <label className="text-sm font-medium max-md:max-w-full">
          {label}
        </label>
      )}
      <input
        type={type}
        className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
