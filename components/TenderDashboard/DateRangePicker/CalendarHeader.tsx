import React from "react";
import LeftArrow from "@/components/ui/LeftArrow.svg";
import RightArrow from "@/components/ui/RightArrow.svg";

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showPrevButton?: boolean;
  showNextButton?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  showPrevButton = true,
  showNextButton = true,
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex gap-10 justify-between items-center w-full max-w-[280px]">
      {showPrevButton ? (
        <button
          className="flex overflow-hidden gap-2 justify-center items-center self-stretch p-2 my-auto rounded-lg hover:bg-gray-100"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <LeftArrow className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-9" /> // Spacer
      )}
      
      <div className="self-stretch my-auto text-base font-semibold text-center text-neutral-600">
        {monthNames[month]} {year}
      </div>
      
      {showNextButton ? (
        <button
          className="flex overflow-hidden gap-2 justify-center items-center self-stretch p-2 my-auto rounded-lg hover:bg-gray-100"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <RightArrow className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-9" /> // Spacer
      )}
    </div>
  );
};
