import * as React from "react";
import { useRouter } from 'next/navigation';
import { SearchBar } from "./SearchBar";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  imageSrc: string;
  showSearch?: boolean;
  actionRoute?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  imageSrc,
  showSearch = false,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full">
      {showSearch && (
        <div className="w-full max-w-[1200px] px-6 mb-6">
          <SearchBar />
        </div>
      )}
      <div className="flex flex-col items-center self-center p-6 mt-20 max-w-full text-center bg-white rounded-lg w-[537px] max-md:px-5 max-md:mt-10">
        <img
          loading="lazy"
          src={imageSrc}
          alt=""
          className="object-contain max-w-full aspect-[1.48] w-[129px]"
        />
        <div className="flex flex-col self-stretch mt-6 w-full text-zinc-800 max-md:max-w-full">
          <h2 className="text-3xl font-semibold max-md:max-w-full">{title}</h2>
          <p className="mt-2 text-base leading-6 max-md:max-w-full">{description}</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="justify-center px-4 py-2.5 mt-6 text-base font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors w-full max-w-[320px]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}; 