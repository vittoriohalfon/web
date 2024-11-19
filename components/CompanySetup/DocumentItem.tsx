import * as React from 'react';
import { DocumentItemProps } from './types';

export const DocumentItem: React.FC<DocumentItemProps> = ({ 
  fileName, 
  fileSize,
  onDelete,
  onView 
}) => {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center p-4 w-full bg-white border border-solid border-zinc-300 rounded-lg max-md:max-w-full">
      <div className="flex gap-2 items-center self-stretch my-auto text-base text-neutral-950">
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/800bc5167115802addb4eee8088f7d8dc0e3160324e74dc07ea49cf7b5ca07ad?apiKey=27ce83af570848e9b22665bc31a03bc0&" 
          alt="" 
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" 
        />
        <div className="self-stretch my-auto">{fileName}</div>
      </div>
      <div className="flex gap-6 items-center self-stretch my-auto text-sm text-neutral-500">
        <div className="self-stretch my-auto">{fileSize}</div>
        {onView && (
          <button 
            onClick={onView}
            aria-label="View document"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b5b7a079a983d64971e07d32b1ad7aae5e156e178639d58877ad46001955b441?apiKey=27ce83af570848e9b22665bc31a03bc0&" 
              alt="" 
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" 
            />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete}
            aria-label="Delete document"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/5581d6ea48a3a25df149267b67131b79defa19915d589376031943f6a3e9e595?apiKey=27ce83af570848e9b22665bc31a03bc0&" 
              alt="" 
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]" 
            />
          </button>
        )}
      </div>
    </div>
  );
}; 