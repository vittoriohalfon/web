import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { ProgressBar } from "./ProgressBar";
import { SetupStep } from "./types";
import { NavigationButtons } from "./NavigationButtons";
import { saveToSessionStorage, getFromSessionStorage, clearSessionStorage } from '@/utils/sessionStorage';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface FinalStepsProps {
  onPrevious: () => void;
  onComplete: () => void;
}

export const FinalSteps: React.FC<FinalStepsProps> = ({
  onPrevious,
  onComplete,
}) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

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
      setSelectedFeedbackSource(savedData.finalSteps.feedbackSource);
      setSelectedGoal(savedData.finalSteps.goal);
    }
  }, []);

  const handleComplete = async () => {
    if (!isLoaded || !user) {
      console.error('User not loaded');
      return;
    }

    try {
      const allData = getFromSessionStorage();
      console.log('Retrieved data from session storage:', allData);

      if (!allData?.companySetup?.companyName) {
        throw new Error('Company name is required');
      }

      const submitData = {
        companySetup: allData?.companySetup,
        editableFields: allData?.editableFields,
        finalSteps: {
          feedbackSource: selectedFeedbackSource,
          goal: selectedGoal
        },
        pastPerformance: allData?.pastPerformance
      };

      console.log('Submitting company setup data:', submitData);
      
      const response = await fetch('/api/user/save-company-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || 
          responseData?.error || 
          `Failed to save company setup (${response.status})`
        );
      }

      const companyId = responseData.companyId;
      if (!companyId) {
        throw new Error('No company ID returned from server');
      }

      console.log('Company created with ID:', companyId);

      // Handle file uploads, if present
      if (allData?.pastPerformance?.files?.length > 0) {
        try {
          await handleFileUploads(allData.pastPerformance.files, companyId);
        } catch (error) {
          console.error('Error uploading files:', error);
          alert('Company setup was saved, but there was an error uploading files. Please try uploading files again later.');
        }
      }

      // Clear session storage after successful submission
      clearSessionStorage();
      console.log('Session storage cleared');
      
      // Call the completion handler and redirect to dashboard
      onComplete();
      router.push('/dashboard');

    } catch (error) {
      console.error('Error saving company setup:', error);
      alert(
        error instanceof Error 
          ? error.message 
          : 'Failed to save company setup. Please try again.'
      );
    }
  };

  const handleFileUploads = async (files: { name: string; content: string; size: number; type: string; }[], companyId: number) => {
    console.log('Preparing files for upload:', files.length);
    
    if (!Array.isArray(files)) {
      console.error('Files is not an array:', files);
      throw new Error('Invalid files data');
    }

    // Verify each file has the required data
    const filesData = files.map(file => {
      if (!file.content) {
        console.error('File missing content:', file);
        throw new Error(`File ${file.name} is missing required content`);
      }
      
      return {
        name: file.name,
        content: file.content,
        size: file.size,
        type: file.type
      };
    });

    console.log('Uploading files to server...');
    const uploadResponse = await fetch('/api/upload-files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: filesData,
        companyId
      }),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Failed to upload files: ${errorText}`);
    }
    
    console.log('Files uploaded successfully');
  };

  // Save current step data when navigating away
  const handlePrevious = () => {
    saveToSessionStorage({
      ...getFromSessionStorage(),
      finalSteps: {
        feedbackSource: selectedFeedbackSource,
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
              isUploadDisabled={!selectedFeedbackSource || !selectedGoal}
              isUploading={false}
              uploadButtonText="Complete"
            />
          </div>
        </main>
      </div>
    </div>
  );
};