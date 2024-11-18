import React from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDays } from "./CalendarDays";

interface CalendarMonthProps {
  month: number;
  year: number;
  selectedDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showPrevButton?: boolean;
  showNextButton?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  month,
  year,
  selectedDate,
  startDate,
  endDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  showPrevButton = true,
  showNextButton = true,
}) => {
  return (
    <div className="flex overflow-hidden flex-col min-w-[240px] w-[328px]">
      <div className="flex flex-col justify-center px-6 py-5 w-full max-md:px-5">
        <div className="flex flex-col w-full">
          <CalendarHeader 
            month={month} 
            year={year}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            showPrevButton={showPrevButton}
            showNextButton={showNextButton}
          />
          <CalendarDays
            month={month}
            year={year}
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            onDateSelect={onDateSelect}
          />
        </div>
      </div>
    </div>
  );
};
