'use client';

import React from "react";
import { TenderCard } from "./TenderCard";
import { TenderCardSkeleton } from "./TenderCardSkeleton";
import { Tender } from "@/types/tender";

const countryCodeToFlagPath = (countryCode: string): string => {
  console.log("Input countryCode:", countryCode);
  
  if (!countryCode) {
    console.log("Country code is null/undefined");
    return '/flags/eu.svg';
  }

  if (countryCode.trim() === '') {
    console.log("Country code is empty or whitespace");
    return '/flags/eu.svg';
  }

  const countryMapping: { [key: string]: string } = {
    'ITA': 'italy',
    'ESP': 'spain', 
    'IRL': 'ireland',
    'NOR': 'norway',
    'FRA': 'france',
    'DEU': 'germany',
    'NLD': 'netherlands',
    'BEL': 'belgium',
    'POL': 'poland',
    'PRT': 'portugal',
    'ROU': 'romania',
    'AUT': 'austria',
    'SWE': 'sweden',
    'FIN': 'finland',
    'DNK': 'denmark',
    'CZE': 'czech-republic',
    'GRC': 'greece',
    'BGR': 'bulgaria',
    'HRV': 'croatia',
    'SVK': 'slovakia',
    'LTU': 'lithuania',
    'LVA': 'latvia',
    'EST': 'estonia',
    'CYP': 'cyprus',
    'HUN': 'hungary',
    'SVN': 'slovenia',
    'LUX': 'luxembourg',
    'MLT': 'malta'
  };

  const code = countryCode.toUpperCase().trim();
  console.log(`Processing country code: "${code}"`);
  const mappedCountry = countryMapping[code];
  
  if (!mappedCountry) {
    console.log(`Unknown country code: "${code}"`);
    return '/flags/eu.svg';
  }
  
  const flagPath = `/flags/${mappedCountry}.svg`;
  console.log(`Successfully mapped to: ${flagPath}`);
  return flagPath;
};

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

  return (
    <div className="flex flex-col gap-4 p-6 w-full max-md:px-5 max-md:max-w-full">
      {tenders.map((tender, index) => {
        console.log(`Tender ${index} country:`, tender.country);
        return (
          <TenderCard 
            key={index} 
            tender={{
              id: tender.notice_id,
              title: tender.title,
              description: tender.description,
              match: tender.match_percentage,
              budget: tender.amount ? `${tender.currency} ${tender.amount.toLocaleString()}` : 'N/A',
              country: tender.country || 'EU',
              countryFlag: tender.country 
                ? countryCodeToFlagPath(tender.country)
                : '/flags/eu.svg',
              lots: tender.lot_count,
              status: tender.status === 'green' ? 'Active' : tender.status === 'yellow' ? 'Pending' : 'Closed',
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
