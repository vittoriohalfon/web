import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { SetupStep } from "./types";
import { NavigationButtons } from "./NavigationButtons";
import { saveToSessionStorage, getFromSessionStorage, clearSessionStorage } from '@/utils/sessionStorage';

interface FinalStepsProps {
  onPrevious: () => void;
  onComplete: () => void;
}

export const FinalSteps: React.FC<FinalStepsProps> = ({
  onPrevious,
  onComplete,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const industries = [
    "Technology",
    "Healthcare",
    "Construction",
    "Education",
    "Manufacturing",
    "Other",
  ];

  const goals = [
    "Win more government contracts",
    "Expand business reach",
    "Increase revenue",
    "Improve tender success rate",
    "Other",
  ];

  // Load saved data from session storage
  useEffect(() => {
    const savedData = getFromSessionStorage();
    if (savedData?.finalSteps) {
      setSelectedIndustry(savedData.finalSteps.industry);
      setSelectedGoal(savedData.finalSteps.goal);
    }
  }, []);

  const handleComplete = async () => {
    try {
      // Get all saved data
      const allData = getFromSessionStorage();
      
      // Prepare final data object
      const finalData = {
        companySetup: allData.companySetup,
        editableFields: allData.editableFields,
        pastPerformance: allData.pastPerformance,
        finalSteps: {
          industry: selectedIndustry,
          goal: selectedGoal
        }
      };

      // Send to your API endpoint
      const response = await fetch('/api/company-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Failed to save company setup data');
      }

      // Clear session storage after successful submission
      clearSessionStorage();
      
      // Call the completion handler
      onComplete();
    } catch (error) {
      console.error('Error saving company setup:', error);
      alert('Failed to save company setup. Please try again.');
    }
  };

  // Save current step data when navigating away
  const handlePrevious = () => {
    saveToSessionStorage({
      ...getFromSessionStorage(),
      finalSteps: {
        industry: selectedIndustry,
        goal: selectedGoal
      },
      currentStep: 'finalSteps'
    });
    onPrevious();
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <CompanyInfo />
        <main className="flex flex-col ml-5 w-[69%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-32 pt-12 w-full pb-[613px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
            <ProgressBar currentStep={SetupStep.FinalSteps} />
            <section className="flex flex-col mt-16 w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col w-full max-md:max-w-full">
                <h1 className="text-2xl font-semibold leading-tight text-neutral-950 max-md:max-w-full">
                  Final Steps
                </h1>
                <p className="mt-2 text-base leading-5 text-zinc-600 max-md:max-w-full">
                  Help us understand your business better to provide more relevant opportunities.
                </p>
              </div>

              <div className="flex flex-col gap-6 mt-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-950">
                    What industry are you primarily in?
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="px-3.5 py-2.5 text-base bg-white rounded-lg border border-solid border-zinc-300 text-neutral-900"
                    style={{
                      color: selectedIndustry ? '#171717' : '#525252',
                      fontWeight: selectedIndustry ? '500' : '400'
                    }}
                  >
                    <option value="" className="text-neutral-500">
                      Select Industry Type
                    </option>
                    {industries.map((industry) => (
                      <option 
                        key={industry} 
                        value={industry}
                        className="text-neutral-900 font-medium"
                      >
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-950">
                    What do you hope to achieve with Skim?
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
                      Select Your Goal
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
              onSkip={handleComplete}
              onUpload={handleComplete}
              isUploadDisabled={!selectedIndustry || !selectedGoal}
              isUploading={false}
              uploadButtonText="Complete"
            />
          </div>
        </main>
      </div>
    </div>
  );
};