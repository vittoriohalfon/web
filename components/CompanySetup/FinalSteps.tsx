import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { SetupStep } from "./types";
import { NavigationButtons } from "./NavigationButtons";

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
                    className="px-3.5 py-2.5 text-base bg-white rounded-lg border border-solid border-zinc-300"
                  >
                    <option value="">Select Industry Type</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
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
                    className="px-3.5 py-2.5 text-base bg-white rounded-lg border border-solid border-zinc-300"
                  >
                    <option value="">Select Your Goal</option>
                    {goals.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
            <NavigationButtons
              onPrevious={onPrevious}
              onSkip={onComplete}
              onUpload={onComplete}
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