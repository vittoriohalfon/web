import React from "react";
import { SetupStep } from './types';

interface ProgressBarProps {
  currentStep: SetupStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    {
      id: SetupStep.CompanySetup,
      label: "Company Info",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/62a8f2c12fe24c0651099e67102b589d52b18bc4896f70492901633f53dc67a5?placeholderIfAbsent=true&apiKey=27ce83af570848e9b22665bc31a03bc0",
    },
    {
      id: SetupStep.PastPerformance,
      label: "Past Performance",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/62e97babb51740b1a4328c881dd0194a37782d78b3a351ee5ef773a66d01aa29?placeholderIfAbsent=true&apiKey=27ce83af570848e9b22665bc31a03bc0",
    },
    { 
      id: SetupStep.FinalSteps,
      label: "Final Steps", 
      icon: "" 
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  return (
    <nav
      className="flex flex-wrap gap-6 items-center self-start text-sm font-medium leading-none text-indigo-700 max-md:max-w-full"
      aria-label="Progress"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          {index > 0 && (
            <div
              className="shrink-0 self-stretch my-auto w-16 h-px border border-solid bg-zinc-300 border-zinc-300"
              aria-hidden="true"
            />
          )}
          <div
            className={`flex flex-col justify-center items-center self-stretch my-auto rounded-md min-h-[42px] ${
              index > getCurrentStepIndex() ? "text-neutral-500" : ""
            }`}
          >
            {step.icon ? (
              <img
                src={step.icon}
                alt=""
                className="object-contain aspect-square w-[18px]"
              />
            ) : (
              <div>{index + 1}</div>
            )}
            <div className="mt-1.5">{step.label}</div>
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};
