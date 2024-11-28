import React from 'react';
import type { DocumentItemProps } from './types';

export const DocumentItem: React.FC<DocumentItemProps> = ({
  fileName,
  fileSize,
  onDelete,
  onView
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-left">
          <p className="font-medium text-gray-900">{fileName}</p>
          <p className="text-sm text-gray-500">{fileSize}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-800"
        >
          View
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}; 