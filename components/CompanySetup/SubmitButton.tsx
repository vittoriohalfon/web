import React from "react";

interface SubmitButtonProps {
  isValid: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isValid,
  onClick,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col items-end mt-6 w-full text-base text-center text-white whitespace-nowrap max-md:max-w-full">
      <button
        className={`gap-2 self-stretch px-4 py-2.5 rounded-lg border border-solid flex items-center justify-center ${
          isValid
            ? "bg-indigo-700 border-indigo-700 cursor-pointer"
            : "bg-indigo-200 border-indigo-50 opacity-50 cursor-not-allowed"
        }`}
        onClick={isValid && !isLoading ? onClick : undefined}
        disabled={!isValid || isLoading}
        aria-disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
};
