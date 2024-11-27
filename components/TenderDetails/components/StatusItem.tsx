import * as React from "react";
import { StatusItemProps } from "../types";

export const StatusItem: React.FC<StatusItemProps> = ({ 
  icon, 
  label, 
  isFirst, 
  isLast 
}) => {
  return (
    <div 
      role="option"
      tabIndex={0}
      className={`
        flex gap-2 items-center px-3 py-2 w-full bg-white hover:bg-gray-50 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-gray-50
        cursor-pointer
        ${isFirst ? 'rounded-t' : ''} 
        ${isLast ? 'rounded-b' : ''}
      `}
    >
      <img
        loading="lazy"
        src={icon}
        alt=""
        aria-hidden="true"
        className="object-contain shrink-0 w-5 h-5"
      />
      <p className="flex-1 truncate">{label}</p>
    </div>
  );
}; 