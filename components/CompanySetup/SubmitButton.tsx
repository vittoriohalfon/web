import React from "react";

interface SubmitButtonProps {
  isValid: boolean;
  onClick: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isValid,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-end mt-6 w-full text-base text-center text-white whitespace-nowrap max-md:max-w-full">
      <button
        className={`gap-2 self-stretch px-4 py-2.5 rounded-lg border border-solid ${
          isValid
            ? "bg-indigo-700 border-indigo-700 cursor-pointer"
            : "bg-indigo-200 border-indigo-50 opacity-50 cursor-not-allowed"
        }`}
        onClick={isValid ? onClick : undefined}
        disabled={!isValid}
        aria-disabled={!isValid}
      >
        Next
      </button>
    </div>
  );
};
