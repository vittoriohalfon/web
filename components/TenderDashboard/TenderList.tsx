'use client';

import React from "react";
import { TenderCard } from "./TenderCard";
import { TenderCardSkeleton } from "./TenderCardSkeleton";
import { EmptyState } from "./EmptyState";
import { Tender } from "@/types/tender";
import { usePathname } from 'next/navigation';
import { countryCodeToFlagPath } from "@/utils/codeConvertor";

interface TenderListProps {
  tenders: Tender[];
  loading: boolean;
  error: string | null;
  onSearchResults?: (results: any[]) => void;
  setLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
}

export const TenderList: React.FC<TenderListProps> = ({ 
  tenders, 
  loading, 
  error,
  onSearchResults,
  setLoading,
  setError
}) => {
  const pathname = usePathname();
  const isLikedTenders = pathname === '/liked-tenders';
  const isDashboard = pathname === '/dashboard';

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 w-full max-md:px-5">
        {[...Array(3)].map((_, index) => (
          <TenderCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state for liked tenders page when no tenders are liked
  if (isLikedTenders && (!tenders || tenders.length === 0)) {
    return (
      <EmptyState
        title="Get Started!"
        description="You haven't liked any tenders yet. Start exploring to find opportunities!"
        actionLabel="Start Search"
        imageSrc="/logo-white.svg"
        showSearch={false}
        actionRoute="/dashboard"
      />
    );
  }

  // For dashboard with no search results
  if (isDashboard && (!tenders || tenders.length === 0)) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg">No tenders found matching your criteria.</p>
        <p className="mt-2">Try adjusting your search or check back later for new opportunities.</p>
      </div>
    );
  }

  // For any other case with no tenders
  if (!tenders || tenders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg">No tenders available.</p>
        <p className="mt-2">Please check back later.</p>
      </div>
    );
  }

  const formatTenderForCard = (tender: any) => ({
    id: tender.notice_id,
    title: tender.title,
    description: tender.description,
    match: tender.score 
      ? Math.round(tender.score * 100) 
      : (tender.match_percentage || 0),
    budget: tender.estimated_value && tender.currency 
      ? `${tender.currency} ${tender.estimated_value.toLocaleString()}`
      : (tender.amount && tender.currency 
        ? `${tender.currency} ${tender.amount.toLocaleString()}`
        : 'N/A'),
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
    submissionDate: tender.deadline 
      ? new Date(tender.deadline).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A',
    dueIn: tender.deadline 
      ? `${Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
      : 'N/A',
    isLiked: tender.is_liked || tender.isLiked || false,
  });

  return (
    <div className="flex flex-col gap-4 p-6 w-full max-md:px-5">
      {tenders.map((tender) => (
        <TenderCard 
          key={tender.notice_id || tender.id} 
          tender={formatTenderForCard(tender)}
        />
      ))}
    </div>
  );
};
