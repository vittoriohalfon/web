'use client';

import React from "react";
import { TenderCard } from "./TenderCard";
import { TenderCardSkeleton } from "./TenderCardSkeleton";
import { EmptyState } from "./EmptyState";
import { Tender } from "@/types/tender";
import { countryCodeToFlagPath } from "@/utils/codeConvertor";

interface TenderListProps {
  tenders: Tender[];
  loading: boolean;
  error: string | null;
}

export const TenderList: React.FC<TenderListProps> = ({ tenders, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 w-full max-md:px-5 max-md:max-w-full">
        {[1, 2, 3].map((index) => (
          <TenderCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (tenders.length === 0) {
    return (
      <EmptyState
        title="Get Started!"
        description="You haven't liked any tenders yet. Start exploring to find opportunities!"
        actionLabel="Start Search"
        imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/f8c8b848ef6c5cb291ea5f1227b8af001596c0f6316429fcbf1b61111d2ac444?placeholderIfAbsent=true&apiKey=94e3216da1274ce18b1afabc0138b324"
        showSearch={true}
        actionRoute="/dashboard"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-full max-md:px-5 max-md:max-w-full">
      {tenders.map((tender, index) => {
        console.log(`Tender ${index} country:`, tender.country);
        console.log(`Tender budget:`, { amount: tender.amount, currency: tender.currency });
        return (
          <TenderCard 
            key={index} 
            tender={{
              id: tender.notice_id,
              title: tender.title,
              description: tender.description,
              match: tender.match_percentage,
              budget: (tender.amount !== null && tender.amount !== undefined && tender.currency !== null && tender.currency !== undefined)
                ? `${tender.currency} ${tender.amount.toLocaleString()}`
                : 'N/A',
              country: tender.country || 'EU',
              countryFlag: tender.country 
                ? countryCodeToFlagPath(tender.country)
                : '/flags/eu.svg',
              lots: tender.lot_count,
              status: 'Open',
              posted: new Date(tender.published).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              submissionDate: tender.deadline ? new Date(tender.deadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A',
              dueIn: tender.deadline ? getDaysRemaining(new Date(tender.deadline)) : 'N/A',
              isLiked: tender.isLiked,
            }}
          />
        );
      })}
    </div>
  );
};

function getDaysRemaining(deadline: Date): string {
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days`;
}
