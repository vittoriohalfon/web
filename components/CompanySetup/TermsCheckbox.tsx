import React from "react";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
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
            aria-label="Accept Terms of Service"
          />
        </div>
        <label className="self-stretch my-auto text-sm text-neutral-950">
          <span className="text-zinc-700">I accept the</span>{" "}
          <a
            href="https://justskim.notion.site/Terms-of-Service-14828f7d874c80e090f9f781df7efd5d?pvs=74"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service*
          </a>
        </label>
      </div>
    </div>
  );
};
