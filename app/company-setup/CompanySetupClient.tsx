'use client';

import React, { useState } from 'react';
import { CompanySetupForm } from '@/components/CompanySetup/CompanySetupForm';
import { PastPerformance } from '@/components/CompanySetup/PastPerformance';
import { FinalSteps } from '@/components/CompanySetup/FinalSteps';
import { SetupStep } from '@/components/CompanySetup/types';
import { useRouter } from 'next/navigation';

export default function CompanySetupClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.CompanySetup);

  const handleNext = () => {
    if (currentStep === SetupStep.CompanySetup) {
      setCurrentStep(SetupStep.PastPerformance);
    } else if (currentStep === SetupStep.PastPerformance) {
      setCurrentStep(SetupStep.FinalSteps);
    }
  };

  const handlePrevious = () => {
    if (currentStep === SetupStep.PastPerformance) {
      setCurrentStep(SetupStep.CompanySetup);
    } else if (currentStep === SetupStep.FinalSteps) {
      setCurrentStep(SetupStep.PastPerformance);
    }
  };

  const handleComplete = () => {
    router.push('/home');
  };

  const handleFileUpload = async () => {
    handleNext();
  };

  return (
    <div>
      {currentStep === SetupStep.CompanySetup && (
        <CompanySetupForm onNext={handleNext} />
      )}
      {currentStep === SetupStep.PastPerformance && (
        <PastPerformance
          onPrevious={handlePrevious}
          onSkip={handleNext}
          onUpload={handleFileUpload}
        />
      )}
      {currentStep === SetupStep.FinalSteps && (
        <FinalSteps
          onPrevious={handlePrevious}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
} 