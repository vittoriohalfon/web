import React from 'react';
import { DocumentItem } from './DocumentItem';

interface Document {
  id: number;
  fileName: string;
  fileUrl: string;
  size: number;
  uploadedAt: Date;
  contentType?: string;
}

interface DocumentsListProps {
  documents: Document[];
  onDelete: (id: number) => void;
  onView: (document: Document) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDelete,
  onView,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {documents.map((document) => (
        <DocumentItem
          key={document.id}
          id={document.id}
          fileName={document.fileName}
          fileSize={formatFileSize(document.size)}
          onDelete={() => onDelete(document.id)}
          onView={() => onView(document)}
        />
      ))}
    </div>
  );
}; 