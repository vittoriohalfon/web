import React, { useEffect, useState } from "react";

interface AutoFillButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const AutoFillButton: React.FC<AutoFillButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  const [loadingText, setLoadingText] = useState("Loading.");

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText((current) => {
          if (current === "Loading.") return "Loading..";
          if (current === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 300); // Changes every 500ms

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <button
      className={`flex gap-2 justify-center items-center self-end px-4 py-2.5 mt-4 text-base text-center whitespace-nowrap rounded-lg border border-solid cursor-pointer ${
        disabled || isLoading
          ? "text-gray-400 border-gray-400 cursor-not-allowed"
          : "text-indigo-700 border-indigo-700"
      }`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      <span className="self-stretch my-auto">
        {isLoading ? loadingText : "AutoFill"}
      </span>
      {!isLoading && (
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/e0bbfa577a2666b530bd7a916998cd2b4de9cb5613bb3779ce2517c71f73ee4e?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
          alt=""
        />
      )}
    </button>
  );
};