import * as React from "react";
import { ContractSummary as ContractSummaryType } from "../types";

interface ContractSummaryProps {
  data: ContractSummaryType;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({ data }) => {
  return (
    <div className="flex flex-col justify-center px-6 py-7 w-full text-base font-medium rounded-lg border border-solid border-stone-300 min-h-[296px] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex gap-6 items-center w-full max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0">
            <div className="flex flex-col w-full">
              <div className="text-stone-500">Location of contract</div>
              <div className="mt-2 text-neutral-950">{data.location}</div>
            </div>
            <div className="flex flex-col mt-6 w-full">
              <div className="text-stone-500">Amount of Lots</div>
              <div className="mt-2 text-neutral-950">{data.lots}</div>
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0">
            <div className="flex flex-col w-full">
              <div className="text-stone-500">Value of contract</div>
              <div className="mt-2 text-neutral-950">{data.value}</div>
            </div>
            <div className="flex flex-col mt-6 w-full whitespace-nowrap">
              <div className="text-stone-500">Status</div>
              <div className="mt-2 text-neutral-950">{data.status}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6 w-full max-md:max-w-full">
          <div className="text-stone-500 max-md:max-w-full">
            Address for Submission
          </div>
          {data.submissionUrl ? (
            <a
              href={data.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 leading-6 text-indigo-700 underline decoration-auto decoration-solid underline-offset-auto max-md:max-w-full"
            >
              {data.submissionUrl}
            </a>
          ) : (
            <div className="mt-2 text-neutral-500">Not available</div>
          )}
        </div>
      </div>
    </div>
  );
};