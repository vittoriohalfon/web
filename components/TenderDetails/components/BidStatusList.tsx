import * as React from "react";
import { StatusItem } from "./StatusItem";
import { BidStatusListProps } from "../types";

export const BidStatusList: React.FC<BidStatusListProps> = ({
  className = "",
  onStatusChange,
  currentStatus,
  items
}) => {
  return (
    <section 
      className={`flex flex-col text-sm shadow-lg max-w-[151px] text-neutral-950 ${className}`}
      role="listbox"
      aria-label="Bid Status List"
      aria-orientation="vertical"
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          onClick={() => onStatusChange?.(item.label)}
          aria-selected={currentStatus === item.label}
        >
          <StatusItem
            icon={item.icon}
            label={item.label}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        </div>
      ))}
    </section>
  );
}; 