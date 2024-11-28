import React, { useState, useEffect } from 'react';
import { FileUploader } from './FileUploader';
import { DocumentsList } from './DocumentsList';

interface Document {
  id: number;
  fileName: string;
  fileUrl: string;
  size: number;
  uploadedAt: Date;
  contentType?: string;
}

interface FileManagementProps {
  initialFiles?: Document[];
  onFilesChange?: () => void;
}

export const FileManagement: React.FC<FileManagementProps> = ({
  initialFiles = [],
  onFilesChange
}) => {
  const [files, setFiles] = useState<Document[]>(initialFiles);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setError(null);
      const response = await fetch('/api/user/fetch-files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to load files. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (newFiles: File[]) => {
    try {
      setError(null);
      setUploading(true);
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

      await fetchFiles();
      onFilesChange?.();
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/user/delete-file/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      await fetchFiles();
      onFilesChange?.();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Failed to delete file. Please try again.');
    }
  };

  const handleView = (document: Document) => {
    window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <FileUploader onFileSelect={handleFileSelect} disabled={uploading} />
      
      {uploading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-blue-600">Uploading files...</span>
        </div>
      )}
      
      {files.length === 0 && !uploading ? (
        <div className="text-center text-gray-500 py-8">
          No files uploaded yet
        </div>
      ) : (
        <DocumentsList 
          documents={files}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
}; 