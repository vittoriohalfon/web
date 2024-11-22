"use client";

import React, { useEffect, useState } from "react";

interface HeaderProps {
  userCreatedAt: Date;
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ userCreatedAt, showNav = false }) => {
  const TRIAL_PERIOD_DAYS = 14;
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function checkSubscriptionStatus() {
      try {
        const response = await fetch("/api/subscription-status");
        if (response.ok) {
          const data = await response.json();
          setHasActiveSubscription(data.hasActiveSubscription);
        }
      } catch (error) {
        console.error("Failed to check subscription status:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSubscriptionStatus();
  }, []);

  const calculateRemainingDays = () => {
    const now = new Date();
    const trialEndDate = new Date(userCreatedAt);
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);
    
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const handleUpgradeClick = async () => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const remainingDays = calculateRemainingDays();

  if (loading) {
    return <header />; // Or a loading spinner
  }

  return (
    <header>
      {!hasActiveSubscription && remainingDays > 0 && (
        <div className="flex flex-wrap gap-1 justify-center items-center p-2 w-full text-base font-medium text-indigo-700 bg-indigo-50 max-md:max-w-full">
          <div className="self-stretch my-auto">
            You have <span className="font-semibold text-indigo-700">{remainingDays}</span> days
            left of your free trial!
          </div>
          <button 
            onClick={handleUpgradeClick}
            className="gap-2 self-stretch my-auto underline decoration-auto decoration-solid underline-offset-auto cursor-pointer hover:text-indigo-800"
          >
            Upgrade here
          </button>
        </div>
      )}
      {showNav && (
        <nav className="flex flex-col gap-4 justify-center items-start px-6 py-4 w-full text-sm font-medium bg-white max-md:px-5 max-md:max-w-full">
          <div className="flex gap-4 items-center max-md:max-w-full">
            <button className="self-stretch px-4 py-2 my-auto text-white bg-indigo-700 rounded-lg w-[221px]">
              Company Profile
            </button>
            <button className="self-stretch px-4 py-2 my-auto whitespace-nowrap rounded-lg text-stone-500 w-[221px]">
              Files
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
