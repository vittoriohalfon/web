import * as React from "react";
import { BuyerInfo as BuyerInfoType } from "../types";

interface BuyerInfoProps {
  data: BuyerInfoType;
}

export const BuyerInfo: React.FC<BuyerInfoProps> = ({ data }) => {
  return (
    <div className="flex flex-col justify-center p-6 w-full text-base font-medium rounded-lg border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-10 items-start w-full max-md:max-w-full">
        <div className="flex flex-col w-[238px]">
          <div className="flex flex-col w-full">
            <div className="text-stone-500">Name</div>
            <div className="mt-2 text-neutral-950">{data.name}</div>
          </div>
          <div className="flex flex-col mt-8 w-full">
            <div className="text-stone-500">Address</div>
            <div className="mt-2 leading-6 text-neutral-950">{data.address}</div>
          </div>
        </div>
        <div className="flex flex-col w-[238px]">
          <div className="flex flex-col w-full">
            <div className="text-stone-500">Phone</div>
            <div className="mt-2 text-neutral-950">{data.phone}</div>
          </div>
          <div className="flex flex-col mt-8 w-full whitespace-nowrap min-h-[80px]">
            <div className="text-stone-500">Email</div>
            <a
              href={`mailto:${data.email}`}
              className="mt-2 text-indigo-700 underline decoration-auto decoration-solid underline-offset-auto"
            >
              {data.email}
            </a>
          </div>
        </div>
        <div className="flex flex-col whitespace-nowrap w-[238px]">
          <div className="text-stone-500">Website</div>
          <a
            href={data.website}
            className="mt-2 text-indigo-700 underline decoration-auto decoration-solid underline-offset-auto"
          >
            {data.website}
          </a>
        </div>
      </div>
    </div>
  );
};