import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

interface TenderCardProps {
  tender: {
    id: string;
    title: string;
    description: string;
    match: number;
    budget: string;
    country: string;
    countryFlag: string;
    lots: number;
    status: string;
    posted: string;
    submissionDate: string;
    dueIn: string;
    isLiked?: boolean;
  };
}

export const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
  const [isLiked, setIsLiked] = useState(tender.isLiked || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/like-tender', {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractNoticeId: tender.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} tender`);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating tender like status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/dashboard/${tender.id}`} className="block">
      <div className="flex flex-col gap-4 p-6 w-full bg-white rounded-lg border border-solid shadow-sm border-zinc-300 max-md:px-5 max-md:max-w-full hover:shadow-md transition-shadow">
        <div className="flex flex-wrap justify-between items-center w-full max-md:max-w-full">
          <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-8 min-w-[240px] max-w-[900px] max-md:max-w-full">
            <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full line-clamp-1">{tender.title}</h2>
            <div className="flex gap-4 items-start self-start mt-4 text-xs font-medium leading-loose text-zinc-800">
              <div className={`gap-2 self-stretch px-2 py-1 text-emerald-600 ${tender.match >= 75 ? 'bg-indigo-50' : 'bg-green-100'} rounded border ${tender.match >= 75 ? 'border-indigo-600' : ''} border-solid min-h-[26px]`}>
                {tender.match}% Match
              </div>
              <div className="gap-2 self-stretch px-2 py-1 whitespace-nowrap rounded border border-solid border-zinc-300 min-h-[26px]">
                {tender.budget}
              </div>
              <div className="flex gap-2 items-center px-2 py-1 whitespace-nowrap rounded border border-solid border-zinc-300 min-h-[26px]">
                <img loading="lazy" src={tender.countryFlag} alt={`${tender.country} flag`} className="object-contain shrink-0 self-stretch my-auto aspect-[1.29] w-[18px]" />
                <div className="self-stretch my-auto">{tender.country}</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex gap-1.5 justify-center items-center self-end px-4 py-1.5 my-auto text-sm font-semibold text-center whitespace-nowrap rounded-lg border border-solid w-[98px] transition-colors ${
              isLiked 
                ? 'text-white bg-indigo-700 border-indigo-700' 
                : 'text-indigo-700 bg-white border-indigo-700'
            }`}
          >
            <img 
              loading="lazy" 
              src={isLiked 
                ? "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/4184fe14b05777820a3ea75eef05410c5bdd64ded986d04673b911ecbbeb4e9f?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                : "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/4184fe14b05777820a3ea75eef05410c5bdd64ded986d04673b911ecbbeb4e9f?apiKey=27ce83af570848e9b22665bc31a03bc0&"
              } 
              alt="" 
              className={`object-contain shrink-0 self-stretch my-auto w-5 aspect-square ${isLiked ? 'filter invert' : ''}`}
            />
            <span className="self-stretch my-auto">
              {isLoading ? '...' : (isLiked ? 'Saved' : 'Save')}
            </span>
          </button>
        </div>
        <div className="flex flex-wrap gap-6 w-full max-md:max-w-full">
          <div className="flex flex-col grow shrink min-w-[240px] w-[763px] max-md:max-w-full">
            <div className="prose max-md:max-w-full text-black">
              {tender.description}
            </div>
            <div className="flex flex-wrap flex-1 gap-10 items-center mt-4 whitespace-nowrap size-full max-md:max-w-full">
              <div className="flex flex-col self-stretch my-auto w-[88px]">
                <div className="text-sm leading-none text-stone-500">Lots</div>
                <div className="mt-2 text-base font-medium leading-none text-neutral-950">{tender.lots}</div>
              </div>
              <div className="flex flex-col self-stretch my-auto w-[88px]">
                <div className="text-sm leading-none text-stone-500">Status</div>
                <div className="mt-2 text-base font-medium leading-none text-neutral-950">{tender.status}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink gap-2 pl-4 border-l border-solid border-l-stone-300 border-stone-300 w-[163px]">
            <div className="flex flex-col w-full">
              <div className="text-xs text-stone-500">Posted</div>
              <div className="mt-1 text-base font-medium text-neutral-950">{tender.posted}</div>
            </div>
            <div className="flex flex-col mt-2 w-full">
              <div className="text-xs text-stone-500">Submission Date</div>
              <div className="mt-1 text-base font-medium text-neutral-950">{tender.submissionDate}</div>
            </div>
            <div className="flex flex-col mt-2 max-w-full w-[118px]">
              <div className="text-xs text-stone-500">Due</div>
              <div className="mt-1 text-base font-medium text-neutral-950">{tender.dueIn}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};