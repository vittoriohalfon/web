import * as React from "react";
import { StatusItem } from "./StatusItem";
import { BidStatusListProps } from "../types";

const statusItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/fd1b4e12ffc4c83d7daee159ba9c9706f8fdb18e1d75b95beb9b860d6b5468fd?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Unqualified" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/4b5253fe959ad8505acae37b09ece565cdc0b3fa56809efda590f1e7c7be3999?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "In Review" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/7355b706b91688134cfe0398418361a1dec5cefcf1e22e6971dcff1b4638a7f5?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Bid Prep" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/d1afb5db279b01cfcd166204813db6bf5cc6b6dd42561631ef027ba84a64fe8a?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Bid Submitted" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/d1afb5db279b01cfcd166204813db6bf5cc6b6dd42561631ef027ba84a64fe8a?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Won" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/32d40899edb8932b2fb12f2ee60223fd8b6cac6c8b64d04ca81b97e9e27646e3?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Not relevant" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/32d40899edb8932b2fb12f2ee60223fd8b6cac6c8b64d04ca81b97e9e27646e3?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "No Bid" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/32d40899edb8932b2fb12f2ee60223fd8b6cac6c8b64d04ca81b97e9e27646e3?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Lost" }
];

export const BidStatusList: React.FC<BidStatusListProps> = ({
  className = "",
  onStatusChange,
  currentStatus
}) => {
  return (
    <section 
      className={`flex flex-col text-sm shadow-lg max-w-[151px] text-neutral-950 ${className}`}
      role="listbox"
      aria-label="Bid Status List"
      aria-orientation="vertical"
    >
      {statusItems.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          onClick={() => onStatusChange?.(item.label)}
          aria-selected={currentStatus === item.label}
        >
          <StatusItem
            icon={item.icon}
            label={item.label}
            isFirst={index === 0}
            isLast={index === statusItems.length - 1}
          />
        </div>
      ))}
    </section>
  );
}; 