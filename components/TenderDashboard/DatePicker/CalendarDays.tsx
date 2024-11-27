import React from "react";

interface CalendarDaysProps {
  month: number;
  year: number;
  onDateClick: (date: Date) => void;
  selectedDate: Date | null;
}

export const CalendarDays: React.FC<CalendarDaysProps> = ({
  month,
  year,
  onDateClick,
  selectedDate,
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Create empty cells for the start of the month
  const emptyCells = Array.from({ length: Math.max(0, firstDayOfMonth - 1) });

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
        {emptyCells.map((_, index) => (
          <div
            key={`empty-${index}`}
            className="px-3 py-2.5 w-10 rounded-3xl text-neutral-500"
          ></div>
        ))}
        {days.map((day) => {
          const date = new Date(year, month, day);
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={day}
              onClick={() => onDateClick(date)}
              className={`px-4 py-2.5 w-10 rounded-3xl ${
                isSelected ? "font-medium text-white bg-indigo-600" : ""
              }`}
              aria-label={`${month + 1}/${day}/${year}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
