import React, { useState } from "react";
import { CalendarMonth } from "./CalendarMonth";
import { DateRangeSelector } from "./DateRangeSelector";

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleMonths, setVisibleMonths] = useState(() => {
    const today = new Date();
    return {
      first: today,
      second: new Date(today.getFullYear(), today.getMonth() + 1, 1)
    };
  });

  const handleStartDateChange = (date: Date) => {
    if (!endDate || date <= endDate) {
      setStartDate(date);
      setSelectedDate(date);
      if (onDateRangeChange) onDateRangeChange(date, endDate);
    }
  };

  const handleEndDateChange = (date: Date) => {
    if (!startDate || date >= startDate) {
      setEndDate(date);
      setSelectedDate(date);
      if (onDateRangeChange) onDateRangeChange(startDate, date);
    }
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDate(new Date());
    if (onDateRangeChange) onDateRangeChange(null, null);
  };

  const handlePreviousMonth = () => {
    setVisibleMonths(prev => ({
      first: new Date(prev.first.getFullYear(), prev.first.getMonth() - 1, 1),
      second: new Date(prev.second.getFullYear(), prev.second.getMonth() - 1, 1)
    }));
  };

  const handleNextMonth = () => {
    setVisibleMonths(prev => ({
      first: new Date(prev.first.getFullYear(), prev.first.getMonth() + 1, 1),
      second: new Date(prev.second.getFullYear(), prev.second.getMonth() + 1, 1)
    }));
  };

  return (
    <section
      className="flex fixed top-2/4 left-2/4 items-start bg-white rounded-lg border border-solid shadow-xl -translate-x-2/4 -translate-y-2/4 border-zinc-100 z-[1000]"
      aria-label="Date Range Picker"
    >
      <div className="flex flex-col w-[656px] max-md:max-w-full">
        <div className="flex flex-wrap items-start max-md:max-w-full">
          <CalendarMonth
            month={visibleMonths.first.getMonth()}
            year={visibleMonths.first.getFullYear()}
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            onDateSelect={handleStartDateChange}
            onPrevMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            showNextButton={false}
          />
          <CalendarMonth
            month={visibleMonths.second.getMonth()}
            year={visibleMonths.second.getFullYear()}
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            onDateSelect={handleEndDateChange}
            onPrevMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            showPrevButton={false}
          />
        </div>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateSelect={() => setSelectedDate(startDate || new Date())}
          onEndDateSelect={() => setSelectedDate(endDate || new Date())}
          onClear={clearDates}
          onApply={() => {
            if (onDateRangeChange) onDateRangeChange(startDate, endDate);
          }}
        />
      </div>
    </section>
  );
};
