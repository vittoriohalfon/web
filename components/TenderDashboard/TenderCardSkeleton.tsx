import React from 'react';

export const TenderCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-6 w-full bg-white rounded-lg border border-solid shadow-sm border-zinc-300 max-md:px-5 max-md:max-w-full animate-pulse">
      <div className="flex flex-wrap justify-between items-center w-full max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-8 min-w-[240px] max-md:max-w-full">
          <div className="h-6 bg-zinc-200 rounded-full w-3/4"></div>
          <div className="flex gap-4 items-start self-start mt-4">
            <div className="h-[26px] bg-zinc-200 rounded-full w-[88px]"></div>
            <div className="h-[26px] bg-zinc-200 rounded-full w-[120px]"></div>
            <div className="h-[26px] bg-zinc-200 rounded-full w-[100px]"></div>
          </div>
        </div>
        <div className="h-[34px] bg-zinc-200 rounded-lg w-[98px]"></div>
      </div>
      <div className="flex flex-wrap gap-6 w-full max-md:max-w-full">
        <div className="flex flex-col grow shrink min-w-[240px] w-[763px] max-md:max-w-full">
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 rounded-full w-full"></div>
            <div className="h-4 bg-zinc-200 rounded-full w-5/6"></div>
            <div className="h-4 bg-zinc-200 rounded-full w-4/6"></div>
          </div>
          <div className="flex flex-wrap gap-10 items-center mt-4">
            <div className="flex flex-col w-[88px]">
              <div className="h-3 bg-zinc-200 rounded-full w-1/2 mb-2"></div>
              <div className="h-4 bg-zinc-200 rounded-full w-3/4"></div>
            </div>
            <div className="flex flex-col w-[88px]">
              <div className="h-3 bg-zinc-200 rounded-full w-1/2 mb-2"></div>
              <div className="h-4 bg-zinc-200 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col grow shrink gap-2 pl-4 border-l border-solid border-l-stone-300 border-stone-300 w-[163px]">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col w-full">
              <div className="h-3 bg-zinc-200 rounded-full w-1/2 mb-2"></div>
              <div className="h-4 bg-zinc-200 rounded-full w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 