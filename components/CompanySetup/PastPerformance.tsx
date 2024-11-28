import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { FileUploader } from "../shared/FileUploader";
import { NavigationButtons } from "./NavigationButtons";
import { SetupStep } from "./types";
import { DocumentItem } from "../shared/DocumentItem";

interface PastPerformanceProps {
  onPrevious: () => void;
  onSkip: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

interface FileWithPreview extends File {
  preview?: string;
}

export const PastPerformance: React.FC<PastPerformanceProps> = ({
  onPrevious,
  onSkip,
  onUpload,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isServerUploading, setIsServerUploading] = useState(false);

  useEffect(() => {
    // Clean up previews when component unmounts
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleFileSelect = async (newFiles: File[]) => {
    setIsServerUploading(true);
    try {
      // Create preview URLs for the files
      const filesWithPreviews = newFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));

      setFiles(prev => [...prev, ...filesWithPreviews]);

      // Upload files immediately using FormData
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/user/upload-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload files');
      }

      // Update UI with the uploaded files
      const result = await response.json();
      console.log('Files uploaded successfully:', result);

    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
      // Remove the files that failed to upload
      setFiles(prev => prev.filter(f => !newFiles.includes(f)));
    } finally {
      setIsServerUploading(false);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }
    
    setIsUploading(true);
    try {
      // Call the onUpload prop to move to next step
      await onUpload(files);
    } catch (error) {
      console.error("Failed to complete past performance step:", error);
      alert("Failed to complete this step. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteFile = (indexToDelete: number) => {
    //TODO: Implement file deletion by calling api/user/delete-file/ endpoint
    return indexToDelete;
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <CompanyInfo />
        <main className="flex flex-col ml-[31%] w-[69%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-32 pt-12 w-full pb-[613px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
            <ProgressBar currentStep={SetupStep.PastPerformance} />
            <section className="flex flex-col mt-16 w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col w-full max-md:max-w-full">
                <h1 className="text-2xl font-semibold leading-tight text-neutral-950 max-md:max-w-full">
                  Capabilities and Past Performance
                </h1>
                <p className="body-text-slim mt-2 max-md:max-w-full">
                  Upload files showcasing your company&apos;s capabilities, financial documentation, 
                  insurance, and compliance certifications (e.g., ISO 9001) to 
                  streamline and strengthen your tender applications. 
                  Don&apos;t have them? Skim can walk you through the process
                </p>
              </div>
              <FileUploader
                onFileSelect={handleFileSelect}
              />
              
              {files.length > 0 && (
                <div className="flex flex-col gap-4 mt-8 w-full">
                  {files.map((file, index) => (
                    <DocumentItem
                      key={`${file.name}-${index}`}
                      fileName={file.name}
                      fileSize={formatFileSize(file.size)}
                      onDelete={() => handleDeleteFile(index)}
                      onView={() => window.open(URL.createObjectURL(file), '_blank')}
                    />
                  ))}
                </div>
              )}
            </section>
            <NavigationButtons
              onPrevious={onPrevious}
              onSkip={onSkip}
              onUpload={handleUpload}
              isUploadDisabled={files.length === 0 || isUploading || isServerUploading}
              isUploading={isUploading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};