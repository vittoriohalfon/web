import React from "react";

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex flex-col items-start mt-4 w-full max-md:max-w-full">
      <div className="flex gap-2 items-center">
        <div className="flex justify-center items-center self-stretch my-auto w-5 min-h-[20px]">
          <input
            type="checkbox"
            className="w-4 h-4 bg-white rounded border border-solid cursor-pointer border-stone-300 min-h-[16px]"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-label={label}
          />
        </div>
        <label className="self-stretch my-auto text-sm text-zinc-700">
          {label}
        </label>
      </div>
    </div>
  );
};
