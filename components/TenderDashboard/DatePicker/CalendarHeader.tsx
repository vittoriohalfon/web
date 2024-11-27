import React from "react";

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showPrevButton: boolean;
  showNextButton: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthName,
  year,
  onPrevMonth,
  onNextMonth,
  showPrevButton,
  showNextButton,
}) => {
  return (
    <div className="flex gap-10 justify-between items-center w-full max-w-[280px]">
      {showPrevButton ? (
        <button
          className="flex overflow-hidden gap-2 justify-center items-center self-stretch p-2 my-auto rounded-lg hover:bg-gray-100"
          aria-label="Previous month"
          onClick={onPrevMonth}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/ae8059752f02d94bdb1c8744e08152e31cd9190e5c5738a3d21a15786da684ef?apiKey=27ce83af570848e9b22665bc31a03bc0&"
            alt=""
            className="object-contain self-stretch my-auto w-5 aspect-square"
          />
        </button>
      ) : (
        <div className="w-9" /> // Spacer
      )}
      
      <div className="self-stretch my-auto text-base font-semibold text-center text-neutral-600">
        {monthName} {year}
      </div>
      
      {showNextButton ? (
        <button
          className="flex overflow-hidden gap-2 justify-center items-center self-stretch p-2 my-auto rounded-lg hover:bg-gray-100"
          aria-label="Next month"
          onClick={onNextMonth}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/d317746f5668ea4586ac1c1ef250131a1219b560ab0d9f6ab3576bcbe2402dd2?apiKey=27ce83af570848e9b22665bc31a03bc0&"
            alt=""
            className="object-contain self-stretch my-auto w-5 aspect-square"
          />
        </button>
      ) : (
        <div className="w-9" /> // Spacer
      )}
    </div>
  );
};
