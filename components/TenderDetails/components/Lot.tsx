import * as React from "react";
import { LotItem } from "../types";

interface LotProps {
  lot: LotItem;
}

export const Lot: React.FC<LotProps> = ({ lot }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const formattedValue = lot.estimatedValue 
    ? `€${lot.estimatedValue.toLocaleString()}`
    : 'N/A';

  return (
    <div className="flex flex-col p-6 w-full bg-white rounded-lg border border-solid shadow-sm border-zinc-300 max-md:px-5">
      <div 
        className="flex gap-6 items-start w-full cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0 px-2.5 text-center text-indigo-700 whitespace-nowrap bg-indigo-50 rounded-full border border-indigo-300 border-solid h-[27px] min-h-[26px] w-[27px] flex items-center justify-center">
              {lot.number}
            </div>
            <div className={`text-neutral-950 font-semibold ${!isExpanded ? 'truncate' : ''}`}>
              {lot.title}
            </div>
          </div>
          <div className={`mt-2 text-neutral-950 break-words ${!isExpanded ? 'line-clamp-1' : ''}`}>
            {lot.description}
          </div>
        </div>
        <img
          loading="lazy"
          src={isExpanded 
            ? "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/c661171fab93fec4d835646f1cf301cf6565947497b440bcbf4b046119dd52f5?apiKey=27ce83af570848e9b22665bc31a03bc0&" 
            : "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b37a8bb90cc4ed1b56e071cb80a5177dfecf55c25af24cbe0bba30c2994ea0ee?apiKey=27ce83af570848e9b22665bc31a03bc0&"}
          alt={isExpanded ? "Collapse" : "Expand"}
          className="flex-shrink-0 w-6 h-6"
        />
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 font-medium">
          <div className="space-y-6">
            <div>
              <div className="text-stone-500">Estimated Value</div>
              <div className="mt-2 text-neutral-950 break-words">
                {formattedValue}
              </div>
            </div>
            <div>
              <div className="text-stone-500">Procurement Type</div>
              <div className="mt-2 text-neutral-950 capitalize break-words">
                {lot.procurementType}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-stone-500">Duration Period</div>
              <div className="mt-2 text-neutral-950">12 months</div>
            </div>
            <div>
              <div className="text-stone-500">Electronic Submission</div>
              <div className="mt-2 text-neutral-950">Allowed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};