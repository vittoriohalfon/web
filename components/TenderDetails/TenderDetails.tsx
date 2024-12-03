"use client";

import * as React from "react";
import { Timeline } from "./components/Timeline";
import { Lot } from "./components/Lot";
import { ContractSummary } from "./components/ContractSummary";
import { Buyer } from "./components/Buyer";
import { Sidebar } from "../shared/Sidebar";
import { BidStatusList } from "./components/BidStatusList";
import { countryCodeToFlagPath } from "@/utils/codeConvertor";
import { Header } from "../shared/Header";
import { useState } from 'react';

interface TenderDetailsProps {
  tenderId: string;
  match_percentage?: number;
}

interface TenderData {
  noticeId: string;
  noticePublicationId: string;
  title: string;
  description: string;
  estimatedValue: number | null;
  attachmentUri: string;
  currency: string;
  country: string;
  match_percentage: number;
  published: string;
  deadline: string;
  lots: Array<{
    lotId: string;
    title: string;
    description: string;
    procurementType: string;
    estimatedValue: number;
  }>;
  buyers: Array<{
    name: string;
    website: string;
    phone: string;
    email: string;
    address_city: string;
    address_street: string;
    address_postal: string;
    address_country: string;
  }>;
  isLiked?: boolean;
}

const statusItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/fd1b4e12ffc4c83d7daee159ba9c9706f8fdb18e1d75b95beb9b860d6b5468fd?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Unqualified" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/4b5253fe959ad8505acae37b09ece565cdc0b3fa56809efda590f1e7c7be3999?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "In Review" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/7355b706b91688134cfe0398418361a1dec5cefcf1e22e6971dcff1b4638a7f5?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Bid Prep" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/d1afb5db279b01cfcd166204813db6bf5cc6b6dd42561631ef027ba84a64fe8a?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Bid Submitted" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/d1afb5db279b01cfcd166204813db6bf5cc6b6dd42561631ef027ba84a64fe8a?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Won" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/32d40899edb8932b2fb12f2ee60223fd8b6cac6c8b64d04ca81b97e9e27646e3?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Not relevant" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/32d40899edb8932b2fb12f2ee60223fd8b6cac6c8b64d04ca81b97e9e27646e3?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "No Bid" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/32d40899edb8932b2fb12f2ee60223fd8b6cac6c8b64d04ca81b97e9e27646e3?apiKey=27ce83af570848e9b22665bc31a03bc0&", label: "Lost" }
];

export const TenderDetails: React.FC<TenderDetailsProps> = ({ 
  tenderId, 
  match_percentage = 0
}) => {
  const [tenderData, setTenderData] = React.useState<TenderData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showBidStatus, setShowBidStatus] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState<{
    label: string;
    icon: string;
  } | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSummaryRequested, setIsSummaryRequested] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  React.useEffect(() => {
    const fetchTenderData = async () => {
      try {
        console.log("Fetching tender data for noticeId:", tenderId);
        const response = await fetch('/api/aurora/specific-contract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            noticeId: tenderId,
            match_percentage: match_percentage
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tender details');
        }

        const data = await response.json();
        setTenderData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenderData();
  }, [tenderId, match_percentage]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBidStatus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (status: string) => {
    const selectedStatus = statusItems.find(item => item.label === status);
    if (selectedStatus) {
      setCurrentStatus(selectedStatus);
    }
    setShowBidStatus(false);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    
    try {
      const response = await fetch('/api/like-tender', {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractNoticeId: tenderId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} tender`);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating tender like status:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleRequestSummary = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSummaryLoading) return;
    
    setIsSummaryLoading(true);
    
    try {
      const response = await fetch('/api/request-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenderId: tenderId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to request summary');
      }

      if (!isLiked) {
        const likeResponse = await fetch('/api/like-tender', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contractNoticeId: tenderId,
          }),
        });

        if (likeResponse.ok) {
          setIsLiked(true);
        }
      }

      setIsSummaryRequested(true);
    } catch (error) {
      console.error('Error requesting summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!tenderData) {
    return <div className="flex justify-center items-center min-h-screen">No data found</div>;
  }

  const countryCode = tenderData.country || tenderData.buyers[0]?.address_country;

  const transformedLots = tenderData.lots.map((lot, index) => ({
    lotId: lot.lotId,
    number: index + 1,
    title: lot.title,
    description: lot.description,
    procurementType: lot.procurementType,
    estimatedValue: lot.estimatedValue
  }));

  const calculateDueIn = (deadline: string): string => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    
    // If past deadline
    if (diffTime < 0) {
      return "EXPIRED";
    }
  
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };
  
  const timelineData = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/446ccb2b086ec643cf1bad459edac9161265bb0daf59c5590c144a45784c07e3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
      title: "Posted",
      date: new Date(tenderData.published).toLocaleString('en-GB', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/446ccb2b086ec643cf1bad459edac9161265bb0daf59c5590c144a45784c07e3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
      title: "Submission Date",
      date: new Date(tenderData.deadline).toLocaleString('en-GB', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/446ccb2b086ec643cf1bad459edac9161265bb0daf59c5590c144a45784c07e3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
      title: "Due In:",
      date: calculateDueIn(tenderData.deadline)
    }
  ];

  const contractSummaryData = {
    location: tenderData.country || 'Not specified',
    lots: tenderData.lots.length,
    value: `${tenderData.currency} ${tenderData.estimatedValue?.toLocaleString() ?? 'N/A'}`,
    status: "Open",
    submissionUrl: tenderData.attachmentUri
  };

  const handlePdfDownload = () => {
    const pdfUrl = `https://ted.europa.eu/en/notice/${tenderData.noticePublicationId}/pdf`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 relative w-full pl-[312px]">
        <div className="flex flex-col h-full overflow-x-hidden">
          <Header userCreatedAt={new Date()} />

          <div className="flex flex-col flex-1 px-6 py-6 max-w-full">
            <nav aria-label="Breadcrumb" className="flex gap-2 items-center mb-6 text-sm leading-none">
              <div className="font-medium text-neutral-600">Home</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/dba9866dc16385808ab5d2c0084659378401e385d4d70b025461b326918bf618?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                alt=""
                className="w-4 h-4"
              />
              <div className="font-semibold text-neutral-950 truncate max-w-[220px]">
                {tenderData.title}
              </div>
            </nav>

            <section className="flex flex-wrap gap-7 justify-between items-start w-full">
              <div className="flex flex-col flex-1 min-w-0">
                <h1
                  className={`font-semibold text-neutral-950 ${
                    tenderData.title.length > 50 ? 'text-xl' : 'text-2xl'
                  }`}
                >
                  {tenderData.title}
                </h1>

                <div className="flex gap-4 items-start self-start mt-4 text-xs font-medium leading-loose text-zinc-800">
                  <div className="gap-2 self-stretch px-2 py-1 text-emerald-600 bg-indigo-50 rounded border border-indigo-600 border-solid min-h-[26px]">
                    {tenderData.match_percentage}% Match
                  </div>
                  <div className="gap-2 self-stretch px-2 py-1 whitespace-nowrap rounded border border-solid border-zinc-300 min-h-[26px]">
                    {tenderData.currency} {tenderData.estimatedValue?.toLocaleString() ?? 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 self-stretch px-2 py-1 whitespace-nowrap rounded border border-solid border-zinc-300 min-h-[26px]">
                    <img
                      loading="lazy"
                      src={countryCodeToFlagPath(countryCode)}
                      alt={`${countryCode} flag`}
                      className="w-[18px] h-auto"
                    />
                    <div className="text-xs font-medium leading-none">{countryCode}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-center text-sm shrink-0">
                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="flex overflow-hidden gap-2 items-center self-stretch h-full leading-none text-neutral-950"
                    onClick={() => setShowBidStatus(!showBidStatus)}
                    aria-expanded={showBidStatus}
                    aria-haspopup="listbox"
                  >
                    {currentStatus ? (
                      <>
                        <img
                          loading="lazy"
                          src={currentStatus.icon}
                          alt=""
                          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                        />
                        <span className="self-stretch my-auto">{currentStatus.label}</span>
                      </>
                    ) : (
                      <>
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/9fb5aa1da55802f5907ee07448f531bff1b06f50ebf3e446efbc5e577f9cb97b?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                          alt=""
                          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                        />
                        <span className="self-stretch my-auto">Set the Status</span>
                      </>
                    )}
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/16945e6630d6bd7aa37ef74f5e07f7c47910c9b5367a25462f3e7f21355cbe89?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                    />
                  </button>
                  {showBidStatus && (
                    <div className="absolute top-full right-0 mt-1 z-50">
                      <BidStatusList
                        currentStatus={currentStatus?.label || ""}
                        onStatusChange={handleStatusChange}
                        className="border border-gray-200 rounded-lg"
                        items={statusItems}
                      />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handlePdfDownload}
                  className="gap-2 self-stretch py-1.5 pr-2.5 pl-2.5 my-auto text-center rounded-lg border border-solid border-zinc-300 text-zinc-800 w-[123px]"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleLike}
                  disabled={isLikeLoading}
                  className={`flex gap-1.5 justify-center items-center self-stretch px-4 py-1.5 my-auto font-semibold text-center whitespace-nowrap rounded-lg border border-solid w-[98px] transition-colors ${
                    isLiked 
                      ? 'text-white bg-indigo-700 border-indigo-700' 
                      : 'text-indigo-700 bg-white border-indigo-700'
                  }`}
                >
                  <img 
                    loading="lazy" 
                    src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/4184fe14b05777820a3ea75eef05410c5bdd64ded986d04673b911ecbbeb4e9f?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                    alt="" 
                    className={`object-contain shrink-0 self-stretch my-auto w-5 aspect-square ${isLiked ? 'filter invert' : ''}`}
                  />
                  <span className="self-stretch my-auto">
                    {isLikeLoading ? '...' : (isLiked ? 'Saved' : 'Save')}
                  </span>
                </button>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-black">Description</h2>
              <p className="p-6 mt-4 text-base leading-6 rounded-lg border border-solid border-zinc-300 break-words text-black">
                {tenderData.description}
              </p>
            </section>

            <div className="flex flex-wrap gap-6 mt-8">
              <section className="flex-1 min-w-[240px] max-w-full">
                <h2 className="text-xl font-semibold text-black">Contract summary</h2>
                <div className="mt-4">
                  <ContractSummary data={contractSummaryData} />
                </div>
              </section>

              <section className="flex-1 min-w-[240px] max-w-full">
                <h2 className="text-xl font-semibold text-black">Timeline</h2>
                <div className="mt-4 rounded-lg border border-solid border-stone-300">
                  <Timeline items={timelineData} />
                </div>
              </section>
            </div>

            <section className="flex flex-col mt-8 w-full max-md:max-w-full">
              <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full">
                Buyers ({tenderData.buyers.length})
              </h2>
              <div className="flex flex-col mt-4 w-full text-base max-md:max-w-full">
                {tenderData.buyers.map((buyer, index) => (
                  <div key={index} className={index > 0 ? "mt-6" : ""}>
                    <Buyer 
                      number={index + 1}
                      name={buyer.name}
                      email={buyer.email}
                      website={buyer.website}
                      phone={buyer.phone}
                      address={{
                        city: buyer.address_city,
                        street: buyer.address_street,
                        postalCode: buyer.address_postal,
                        countryCode: buyer.address_country
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col mt-8 w-full max-md:max-w-full">
              <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full">
                Lots
              </h2>
              <div className="flex flex-col mt-4 w-full text-base max-md:max-w-full">
                {transformedLots.map((lot, index) => (
                  <div key={index} className={index > 0 ? "mt-6" : ""}>
                    <Lot lot={lot} />
                  </div>
                ))}
              </div>
            </section>

            <section className="flex justify-center my-12">
              <button
                onClick={handleRequestSummary}
                disabled={isSummaryLoading || isSummaryRequested}
                className={`flex gap-1.5 justify-center items-center px-6 py-2.5 font-semibold text-center whitespace-nowrap rounded-lg border border-solid transition-colors ${
                  isSummaryRequested 
                    ? 'text-white bg-indigo-700 border-indigo-700' 
                    : 'text-indigo-700 bg-white border-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <span className="self-stretch my-auto text-base">
                  {isSummaryLoading ? '...' : (isSummaryRequested ? 'Summary Requested' : 'Generate Summary Report')}
                </span>
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};