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
  onSearchResults?: (results: any[]) => void;
  setLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  imageSrc,
  showSearch = false,
  actionRoute = '/dashboard',
  onSearchResults,
  setLoading,
  setError
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {showSearch && onSearchResults && setLoading && setError && (
        <section className="w-full bg-white border-t border-b border-solid border-y-zinc-300">
          <div className="p-6 max-md:px-5">
            <SearchBar 
              onSearchResults={onSearchResults}
              setLoading={setLoading}
              setError={setError}
            />
          </div>
        </section>
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
          onClick={() => router.push(actionRoute)}
          className="justify-center px-4 py-2.5 mt-6 text-base font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors w-full max-w-[320px]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}; 