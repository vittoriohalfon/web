'use client';

import React, { useState, useEffect } from 'react';
import { CompanySetupForm } from '@/components/CompanySetup/CompanySetupForm';
import { PastPerformance } from '@/components/CompanySetup/PastPerformance';
import { FinalSteps } from '@/components/CompanySetup/FinalSteps';
import { SetupStep } from '@/components/CompanySetup/types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.CompanySetup);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state or nothing while checking auth
  if (!isLoaded || !isSignedIn) {
    return null;
  }

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
    router.push('/dashboard');
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
          onUpload={async (files) => {
            // Handle file upload
            handleNext();
          }}
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