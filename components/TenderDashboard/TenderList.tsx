'use client';

import React, { useEffect, useState } from "react";
import { TenderCard } from "./TenderCard";
import { TenderCardSkeleton } from "./TenderCardSkeleton";
import { useAuth } from "@clerk/nextjs";

interface Tender {
  title: string;
  description: string;
  amount: number | null;
  currency: string | null;
  status: string;
  match_percentage: number;
  published: string;
  lot_count: number;
  deadline?: string;
  country: string | null;
}

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

export const TenderList: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        // Get the session token
        const sessionToken = await getToken();
        
        const response = await fetch('/api/similarity-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tenders');
        }

        const data = await response.json();

        console.log("Raw JSON from API:", data);
        setTenders(data.contracts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tenders');
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [getToken]);

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
              title: tender.title,
              description: tender.description,
              match: tender.match_percentage,
              budget: tender.amount ? `${tender.currency} ${tender.amount.toLocaleString()}` : 'Not specified',
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
              dueIn: tender.deadline ? getDaysRemaining(new Date(tender.deadline)) : 'Not specified',
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
