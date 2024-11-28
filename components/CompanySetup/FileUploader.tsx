import React from "react";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      
      // Convert files to the required format with base64 content
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          return new Promise<File>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              // Add the base64 content to the file object
              const fileWithContent = Object.assign(file, {
                content: reader.result
              });
              resolve(fileWithContent as File);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Call the parent handler with the processed files
      onFileSelect(processedFiles);
      
      // Clear the input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col mt-8 w-full text-base leading-tight text-center text-stone-500">
      <div className="w-full">
        <div
          role="button"
          tabIndex={0}
          className="flex gap-2 justify-center items-center px-8 py-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer w-full"
          onClick={() => document.getElementById("fileInput")?.click()}
          onKeyPress={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              document.getElementById("fileInput")?.click();
            }
          }}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
            aria-label="Choose files to upload"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e067efeebb7c07f09508905ac76ca2dd9574d88a40f726389dbc865d488cc890?placeholderIfAbsent=true&apiKey=27ce83af570848e9b22665bc31a03bc0"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <span className="self-stretch my-auto">Choose Files</span>
        </div>
      </div>
    </div>
  );
};