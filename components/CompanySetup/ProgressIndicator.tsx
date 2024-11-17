import React from "react";

export const ProgressIndicator: React.FC = () => {
  return (
    <nav
      className="flex flex-wrap gap-6 items-center self-start text-sm font-medium leading-none text-neutral-500 max-md:max-w-full"
      aria-label="Progress"
    >
      <div className="flex flex-col justify-center items-center self-stretch my-auto text-indigo-700 rounded-md min-h-[42px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/717295778ea9dcd6c91365291fe8f61673a58079b3e1a803cd6317ad806e03db?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          className="object-contain aspect-square w-[18px]"
          alt=""
        />
        <div className="mt-1.5">Company Info</div>
      </div>
      <div
        className="shrink-0 self-stretch my-auto w-16 h-px border border-solid bg-zinc-300 border-zinc-300"
        role="separator"
      />
      <div className="flex flex-col justify-center items-center self-stretch my-auto rounded-md min-h-[42px]">
        <div>2</div>
        <div className="mt-1.5">Past Performance</div>
      </div>
      <div
        className="shrink-0 self-stretch my-auto w-16 h-px border border-solid bg-zinc-300 border-zinc-300"
        role="separator"
      />
      <div className="flex flex-col justify-center items-center self-stretch my-auto rounded-md min-h-[42px]">
        <div>3</div>
        <div className="mt-1.5">Final Steps</div>
      </div>
    </nav>
  );
};
