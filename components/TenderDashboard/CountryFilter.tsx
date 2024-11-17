import React from "react";

const countries = [
  {
    name: "France",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/bf8d64f9d62611dbd1335e6efcc698b3398adf7b47fee8eec835a0f6e898f275?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
  {
    name: "Ireland",
    flag: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/edf94a7a974b0958ef40d4f590f34b0c6604dcbc56711c0b7d826b88b63be81c?apiKey=27ce83af570848e9b22665bc31a03bc0&",
  },
];

export const CountryFilter: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-1 shrink justify-between items-center self-stretch px-2 py-2.5 my-auto text-xs font-medium leading-none whitespace-nowrap bg-gray-50 rounded-lg border border-solid shadow-sm basis-4 border-zinc-300 min-h-[44px] min-w-[240px]">
      <div className="flex flex-1 shrink gap-4 items-center self-stretch my-auto w-full basis-0 min-w-[240px]">
        <div className="flex gap-2 items-center self-stretch my-auto">
          {countries.map((country, index) => (
            <div
              key={index}
              className="flex gap-2 items-center self-stretch px-2 py-1 my-auto rounded border border-solid border-zinc-300 min-h-[26px]"
            >
              <img
                loading="lazy"
                src={country.flag}
                alt={`${country.name} flag`}
                className="object-contain shrink-0 self-stretch my-auto aspect-[1.29] w-[18px]"
              />
              <div className="self-stretch my-auto">{country.name}</div>
            </div>
          ))}
          <div className="gap-2 self-stretch px-2 py-1 my-auto rounded border border-solid border-zinc-300 min-h-[26px]">
            +3
          </div>
        </div>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/f0e2860dee9b77a0397dc8a6597a1bb04321b555a68b4d23f6f04d0035c32d64?apiKey=27ce83af570848e9b22665bc31a03bc0&"
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
      />
    </div>
  );
};
