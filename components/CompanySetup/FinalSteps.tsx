import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { SetupStep } from "./types";
import { NavigationButtons } from "./NavigationButtons";
import { useUser } from '@clerk/nextjs';

interface FinalStepsProps {
  onPrevious: () => void;
  onComplete: () => void;
}

export const FinalSteps: React.FC<FinalStepsProps> = ({
  onPrevious,
  onComplete,
}) => {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedFeedbackSource, setSelectedFeedbackSource] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const feedbackSources = [
    "Word of Mouth",
    "Google",
    "Email",
    "Social Media",
    "Other"
  ];

  const goals = [
    "Discover more tender opportunities",
    "Store all my tender information in one place",
    "Bid writing services and assistance",
    "Apply for tenders in different countries",
    "Other",
  ];

  const handleComplete = async () => {
    if (!isLoaded || !user) {
      console.error('User not loaded');
      return;
    }

    if (!selectedFeedbackSource || !selectedGoal) {
      console.error('Missing required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/complete-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackSource: selectedFeedbackSource,
          goal: selectedGoal
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to complete setup: ${errorData}`);
      }

      onComplete();
    } catch (error) {
      console.error('Error completing setup:', error);
      alert('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save current step data when navigating away
  const handlePrevious = () => {
    onPrevious();
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <CompanyInfo />
        <main className="flex flex-col ml-[31%] w-[69%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-32 pt-12 w-full pb-[613px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
            <ProgressBar currentStep={SetupStep.FinalSteps} />
            <section className="flex flex-col mt-16 w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col w-full max-md:max-w-full">
                <h1 className="text-2xl font-semibold leading-tight text-neutral-950 max-md:max-w-full">
                  Final Steps
                </h1>
                <p className="body-text-slim mt-2 max-md:max-w-full">
                  Let&apos;s get some final information from you so we can best tailor your Skim experience.
                </p>
              </div>

              <div className="flex flex-col gap-6 mt-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-950">
                  </label>
                  <select
                    value={selectedFeedbackSource}
                    onChange={(e) => setSelectedFeedbackSource(e.target.value)}
                    className="px-3.5 py-2.5 text-base bg-white rounded-lg border border-solid border-zinc-300 text-neutral-900"
                    style={{
                      color: selectedFeedbackSource ? '#171717' : '#525252',
                      fontWeight: selectedFeedbackSource ? '500' : '400'
                    }}
                  >
                    <option value="" className="text-neutral-500">
                      How did you hear about Skim?
                    </option>
                    {feedbackSources.map((feedbackSource) => (
                      <option 
                        key={feedbackSource} 
                        value={feedbackSource}
                        className="text-neutral-900 font-medium"
                      >
                        {feedbackSource}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-950">
                  </label>
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="px-3.5 py-2.5 text-base bg-white rounded-lg border border-solid border-zinc-300 text-neutral-900"
                    style={{
                      color: selectedGoal ? '#171717' : '#525252',
                      fontWeight: selectedGoal ? '500' : '400'
                    }}
                  >
                    <option value="" className="text-neutral-500">
                      What do you hope to achieve with Skim?
                    </option>
                    {goals.map((goal) => (
                      <option 
                        key={goal} 
                        value={goal}
                        className="text-neutral-900 font-medium"
                      >
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
            <NavigationButtons
              onPrevious={handlePrevious}
              onUpload={handleComplete}
              isUploadDisabled={!selectedFeedbackSource || !selectedGoal}
              isUploading={isSubmitting}
              uploadButtonText="Complete"
            />
          </div>
        </main>
      </div>
    </div>
  );
};