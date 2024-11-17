import React from "react";

interface AutoFillButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const AutoFillButton: React.FC<AutoFillButtonProps> = ({
  onClick,
  isLoading,
}) => {
  return (
    <button
      className="flex gap-2 justify-center items-center self-end px-4 py-2.5 mt-4 text-base text-center text-indigo-700 whitespace-nowrap rounded-lg border border-indigo-700 border-solid cursor-pointer"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      <span className="self-stretch my-auto">
        {isLoading ? "Loading..." : "AutoFill"}
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
