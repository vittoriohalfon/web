import React from "react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSkip?: () => void;
  onUpload: () => void;
  isUploadDisabled: boolean;
  isUploading: boolean;
  uploadButtonText?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onSkip,
  onUpload,
  isUploadDisabled,
  isUploading,
  uploadButtonText = "Continue"
}) => {
  const getLoadingText = (buttonText: string) => {
    switch (buttonText.toLowerCase()) {
      case 'complete':
        return 'Completing...';
      case 'continue':
        return 'Continuing...';
      case 'upload':
        return 'Uploading...';
      default:
        return `${buttonText}...`;
    }
  };

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center mt-6 w-full text-base text-center whitespace-nowrap max-md:max-w-full">
      <button
        className="gap-2 self-stretch px-4 py-2.5 my-auto text-indigo-700 rounded-lg border border-indigo-700 border-solid"
        onClick={onPrevious}
      >
        Previous
      </button>
      <div className="flex gap-4 items-center self-stretch my-auto">
        {onSkip && (
          <button
            className="gap-2 self-stretch px-4 py-2.5 my-auto text-indigo-700 rounded-lg border border-indigo-700 border-solid"
            onClick={onSkip}
          >
            Skip
          </button>
        )}
        <button
          className="flex gap-2 justify-center items-center self-stretch px-4 py-2.5 my-auto text-white bg-indigo-200 rounded-lg border border-indigo-50 border-solid"
          style={{
            ...(isUploadDisabled
              ? { opacity: 0.5, cursor: "not-allowed" }
              : {
                  cursor: "pointer",
                  backgroundColor: "var(--Primary-700, #4228E2)",
                }),
          }}
          disabled={isUploadDisabled || isUploading}
          onClick={onUpload}
        >
          <span className="self-stretch my-auto">
            {isUploading ? getLoadingText(uploadButtonText) : uploadButtonText}
          </span>
        </button>
      </div>
    </div>
  );
};
