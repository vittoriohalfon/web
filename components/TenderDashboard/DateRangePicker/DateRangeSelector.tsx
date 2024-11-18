import React from "react";

interface DateRangeSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateSelect: () => void;
  onEndDateSelect: () => void;
  onClear: () => void;
  onApply: () => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateSelect,
  onEndDateSelect,
  onClear,
  onApply,
}) => {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-start p-4 w-full text-base border-t border-solid border-t-zinc-300 max-md:max-w-full">
      <div className="flex gap-3 items-center min-w-[240px] text-neutral-950">
        <div className="flex flex-col self-stretch my-auto w-[131px]">
          <button
            className="flex gap-2 items-center px-3.5 py-2.5 w-full bg-white rounded-lg border border-solid border-zinc-300"
            onClick={onStartDateSelect}
            aria-label="Select start date"
          >
            <div className="flex flex-1 shrink gap-2.5 items-center self-stretch my-auto w-full basis-0">
              <div className="self-stretch my-auto">
                {startDate ? (
                  <span>{startDate.toLocaleDateString()}</span>
                ) : (
                  <span>Select start date</span>
                )}
              </div>
            </div>
          </button>
        </div>
        <div className="self-stretch my-auto text-neutral-500">–</div>
        <div className="flex flex-col self-stretch my-auto w-[131px]">
          <button
            className="flex gap-2 items-center px-3.5 py-2.5 w-full bg-white rounded-lg border border-solid border-zinc-300"
            onClick={onEndDateSelect}
            aria-label="Select end date"
          >
            <div className="flex flex-1 shrink gap-2.5 items-center self-stretch my-auto w-full basis-0">
              <div className="self-stretch my-auto">
                {endDate ? (
                  <span>{endDate.toLocaleDateString()}</span>
                ) : (
                  <span>Select end date</span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="flex gap-3 items-start text-center whitespace-nowrap">
        <button
          className="gap-2 self-stretch px-4 py-2.5 text-indigo-700 rounded-lg border border-indigo-700 border-solid"
          onClick={onClear}
        >
          Clear
        </button>
        <button
          className="gap-2 self-stretch px-4 py-2.5 text-white bg-indigo-700 rounded-lg border border-indigo-600 border-solid"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
