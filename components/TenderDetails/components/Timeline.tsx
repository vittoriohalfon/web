import * as React from "react";
import { TimelineItem } from "../types";

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="flex flex-col max-w-full w-[335px] min-h-[296px] py-7 px-6">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 w-full">
          <div className="flex flex-col pb-2 my-auto w-11">
            <img
              loading="lazy"
              src={item.icon}
              alt=""
              className="object-contain self-center w-6 aspect-square"
            />
            {index < items.length - 1 && (
              <div className="mt-1 ml-5 w-px bg-transparent border border-indigo-700 border-solid min-h-[44px]" />
            )}
          </div>
          <div className="flex flex-col font-medium min-w-[240px] w-[279px]">
            <div className="text-base text-stone-500">{item.title}</div>
            <div className="mt-2 text-sm text-neutral-950">{item.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};