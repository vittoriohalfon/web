import * as React from "react";
import { LotItem } from "../types";

interface LotProps {
  lot: LotItem;
}

export const Lot: React.FC<LotProps> = ({ lot }) => {
  return (
    <div className="flex flex-col p-6 w-full bg-white rounded-lg border border-solid shadow-sm border-zinc-300 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-6 items-start w-full max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
          <div className="flex gap-2 items-center self-start font-semibold">
            <div className="self-stretch px-2.5 my-auto text-center text-indigo-700 whitespace-nowrap bg-indigo-50 rounded-full border border-indigo-300 border-solid h-[27px] min-h-[26px] w-[27px]">
              {lot.number}
            </div>
            <div className="self-stretch my-auto text-neutral-950">{lot.title}</div>
          </div>
          <div className="mt-2 text-neutral-950 max-md:max-w-full">
            {lot.description}
          </div>
        </div>
        <img
          loading="lazy"
          src={lot.isExpanded ? "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/c661171fab93fec4d835646f1cf301cf6565947497b440bcbf4b046119dd52f5?apiKey=27ce83af570848e9b22665bc31a03bc0&" : "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b37a8bb90cc4ed1b56e071cb80a5177dfecf55c25af24cbe0bba30c2994ea0ee?apiKey=27ce83af570848e9b22665bc31a03bc0&"}
          alt=""
          className="object-contain shrink-0 w-6 aspect-square"
        />
      </div>
      {lot.isExpanded && (
        <div className="flex flex-wrap gap-6 items-center mt-6 w-full font-medium max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
            <div className="flex flex-col w-full max-md:max-w-full">
              <div className="text-stone-500 max-md:max-w-full">Status </div>
              <div className="mt-2 text-neutral-950 max-md:max-w-full">
                {lot.status}
              </div>
            </div>
            <div className="flex flex-col mt-6 w-full max-md:max-w-full">
              <div className="text-stone-500 max-md:max-w-full">
                Procurement Type:
              </div>
              <div className="mt-2 text-neutral-950 max-md:max-w-full">
                {lot.procurementType}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
            <div className="flex flex-col w-full max-md:max-w-full">
              <div className="text-stone-500 max-md:max-w-full">
                Estimated Value
              </div>
              <div className="mt-2 text-neutral-950 max-md:max-w-full">
                {lot.estimatedValue}
              </div>
            </div>
            <div className="flex flex-col mt-6 w-full max-md:max-w-full">
              <div className="text-stone-500 max-md:max-w-full">Duration</div>
              <div className="mt-2 text-neutral-950 max-md:max-w-full">
                {lot.duration}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};