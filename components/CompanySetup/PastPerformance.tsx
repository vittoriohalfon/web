import React, { useState } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { FileUploader } from "./FileUploader";
import { NavigationButtons } from "./NavigationButtons";
import { SetupStep } from "./types";

interface PastPerformanceProps {
  onPrevious: () => void;
  onSkip: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

export const PastPerformance: React.FC<PastPerformanceProps> = ({
  onPrevious,
  onSkip,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles([...files, ...selectedFiles]);
  };

  const handleGoogleDriveSelect = () => {
    console.log("Google Drive integration to be implemented");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }
    setIsUploading(true);
    try {
      await onUpload(files);
      alert("Files uploaded successfully! Proceed to Final Steps");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <CompanyInfo />
        <main className="flex flex-col ml-5 w-[69%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-32 pt-12 w-full pb-[613px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
            <ProgressBar currentStep={SetupStep.PastPerformance} />
            <section className="flex flex-col mt-16 w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col w-full max-md:max-w-full">
                <h1 className="text-2xl font-semibold leading-tight text-neutral-950 max-md:max-w-full">
                  Capabilities and Past Performance
                </h1>
                <p className="mt-2 text-base leading-5 text-zinc-600 max-md:max-w-full">
                  Upload files showcasing your company's capabilities and past
                  work to help Skim find new opportunities. Don't have them?
                  Skim AI can guide you through the proposal process with ease.
                </p>
              </div>
              <FileUploader
                onFileSelect={handleFileSelect}
                onGoogleDriveSelect={handleGoogleDriveSelect}
              />
            </section>
            <NavigationButtons
              onPrevious={onPrevious}
              onSkip={onSkip}
              onUpload={handleUpload}
              isUploadDisabled={files.length === 0 || isUploading}
              isUploading={isUploading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
