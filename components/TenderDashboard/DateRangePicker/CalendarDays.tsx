import React from "react";

interface CalendarDaysProps {
  month: number;
  year: number;
  selectedDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const CalendarDays: React.FC<CalendarDaysProps> = ({
  month,
  year,
  selectedDate,
  startDate,
  endDate,
  onDateSelect,
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const isSelected = (day: number) => {
    const date = new Date(year, month, day);
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === endDate.toDateString();
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(year, month, day);
    return date >= startDate && date <= endDate;
  };

  const getButtonClasses = (day: number) => {
    const baseClasses = "px-3 py-2.5 w-10 rounded-3xl ";
    if (isStartDate(day) || isEndDate(day)) {
      return baseClasses + "font-medium text-white bg-indigo-600";
    }
    if (isSelected(day)) {
      return baseClasses + "font-medium text-white bg-indigo-600";
    }
    if (isInRange(day)) {
      return baseClasses + "bg-indigo-100";
    }
    return baseClasses;
  };

  return (
    <div className="flex flex-col mt-3 w-full text-sm leading-none text-center whitespace-nowrap max-w-[280px] text-neutral-600">
      <div className="flex items-start w-full font-medium">
        {weekdays.map((day) => (
          <div key={day} className="px-3 py-2.5 w-10 rounded-3xl">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="px-3 py-2.5 w-10 rounded-3xl" />
        ))}
        {days.map((day) => (
          <button
            key={day}
            className={getButtonClasses(day)}
            onClick={() => onDateSelect(new Date(year, month, day))}
            aria-label={`${year}-${month + 1}-${day}`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};
