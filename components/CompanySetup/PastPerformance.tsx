import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { FileUploader } from "./FileUploader";
import { NavigationButtons } from "./NavigationButtons";
import { SetupStep } from "./types";
import { saveToSessionStorage, getFromSessionStorage } from '@/utils/sessionStorage';
import { DocumentItem } from './DocumentItem';

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

  useEffect(() => {
    const savedData = getFromSessionStorage();
    if (savedData?.pastPerformance?.files) {
      console.log('Found saved files:', savedData.pastPerformance.files);
    }
  }, []);

  const handleFileSelect = async (files: File[]) => {
    try {
      // Convert files to the required format with base64 content
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          return new Promise<{ name: string; size: number; type: string; content: string | ArrayBuffer | null; }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                content: reader.result
              });
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        })
      );

      // Save to session storage
      saveToSessionStorage({
        ...getFromSessionStorage(),
        pastPerformance: {
          files: processedFiles
        },
        currentStep: SetupStep.PastPerformance
      });

      setFiles(files); // For UI display purposes
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first");
      return;
    }
    setIsUploading(true);
    try {
      await onUpload(files);
      
      const existingData = getFromSessionStorage() || {};
      saveToSessionStorage({
        ...existingData,
        pastPerformance: {
          ...existingData.pastPerformance,
          uploadedFiles: files.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })),
          uploadComplete: true
        },
        currentStep: 'pastPerformance'
      });
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload files. Please try again.");
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
    const newFiles = files.filter((_, index) => index !== indexToDelete);
    setFiles(newFiles);
    
    const existingData = getFromSessionStorage() || {};
    saveToSessionStorage({
      ...existingData,
      pastPerformance: {
        ...existingData.pastPerformance,
        files: newFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      }
    });
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
              isUploadDisabled={files.length === 0 || isUploading}
              isUploading={isUploading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};