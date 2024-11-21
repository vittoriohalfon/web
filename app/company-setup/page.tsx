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
  const [isChecking, setIsChecking] = useState(true);

  // Check if user has already set up company
  useEffect(() => {
    const checkCompanySetup = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/check-company-setup?userId=${user.id}`);
        const data = await response.json();
        
        if (data.hasCompany) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking company setup:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (isLoaded && isSignedIn) {
      checkCompanySetup();
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking auth and company status
  if (!isLoaded || !isSignedIn || isChecking) {
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

  const handleFileUpload = async (files: File[]) => {
    try {
      // Here you would typically upload the files to your server
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful upload, move to next step
      handleNext();
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload files. Please try again.');
    }
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