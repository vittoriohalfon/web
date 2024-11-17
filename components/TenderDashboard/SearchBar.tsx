import React from "react";

export const SearchBar: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2 w-full max-md:max-w-full">
      <div className="flex flex-col flex-1 shrink my-auto text-base basis-5 min-w-[240px] text-neutral-500 max-md:max-w-full">
        <div className="flex gap-2 items-center px-3.5 py-2.5 w-full bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full">
          <label htmlFor="searchInput" className="sr-only">
            Search for contracts
          </label>
          <input
            id="searchInput"
            type="text"
            placeholder="Search for contracts"
            className="flex-1 shrink gap-2.5 self-stretch my-auto w-full min-w-[240px] max-md:max-w-full"
          />
        </div>
      </div>
      <button
        className="flex gap-2.5 justify-center items-center p-2.5 w-11 h-11 bg-indigo-700 rounded-lg border border-indigo-600 border-solid"
        aria-label="Search"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/cf03d652b535d9619c81444fe2b55a073205390fb76a52e7a6f34ca5f826beb1?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          alt=""
          className="object-contain self-stretch my-auto w-5 aspect-square"
        />
      </button>
    </div>
  );
};
