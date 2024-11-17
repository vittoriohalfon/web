"use client"

import React, { useState, useEffect } from "react";
import { CompanyInfo } from "./CompanyInfo";
import { FormSection } from "./FormSection";
import { ProgressIndicator } from "./ProgressIndicator";
import { AutoFillButton } from "./AutoFillButton";
import { TextAreaField } from "./TextAreaField";
import { TermsCheckbox } from "./TermsCheckbox";
import { SubmitButton } from "./SubmitButton";
import { FormData, EditableFields, DropdownOptions } from "./types";
import { useRouter } from "next/navigation";
import { saveToSessionStorage, getFromSessionStorage } from '@/utils/sessionStorage';

interface FormSectionProps {
  formData: FormData;
  dropdownOptions: DropdownOptions;
  updateFormField: (field: keyof FormData, value: string | boolean) => void;
  updateEditableField: (field: keyof EditableFields, value: string) => void;
}

interface CompanySetupFormProps {
  onNext: () => void;
}

// Add this helper function at the top of your component or in a utils file
const cleanContent = (content: string): string => {
  // Remove markdown formatting
  content = content.replace(/\*\*/g, '');
  
  // If content starts with "- ", remove it
  if (content.startsWith('- ')) {
    content = content.substring(2);
  }
  
  // If it's a company name, remove the "Company Name: " prefix
  if (content.startsWith('Company Name: ')) {
    content = content.substring('Company Name: '.length);
  }
  
  return content.trim();
};

export const CompanySetupForm: React.FC<CompanySetupFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyWebsite: "",
    annualTurnover: "",
    primaryLocation: "",
    hasTenderExperience: false,
    termsAccepted: false,
  });

  const [dropdownOptions] = useState<DropdownOptions>({
    turnover: ["Less than €1M", "€1M - €5M", "€5M - €10M", "€10M+"],
    locations: [
      "Europe",
      "North America",
      "Asia",
      "Africa",
      "South America",
      "Oceania",
    ],
  });

  const [isLoading, setIsLoading] = useState(false);

  const [editableFields, setEditableFields] = useState<EditableFields>({
    companyName: "",
    companyWebsite: "",
    industrySector: "",
    companyOverview: "",
    coreProducts: "",
    demographic: "",
    uniqueSellingPoint: "",
    geographic: "",
  });

  const router = useRouter();

  // Load saved data from session storage on component mount
  useEffect(() => {
    const savedData = getFromSessionStorage();
    if (savedData?.companySetup) {
      setFormData(savedData.companySetup);
      setEditableFields(savedData.editableFields);
    }
  }, []);

  const updateFormField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEditableField = (field: keyof EditableFields, value: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
    if (field === "companyName" || field === "companyWebsite") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAutofill = async () => {
    if (!formData.companyWebsite) {
      console.error("Please enter a company website first");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending request with website:", formData.companyWebsite);
      
      const response = await fetch("/api/autofill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: formData.companyWebsite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received API response:", data);

      if (!data.results) {
        console.error("No results in API response");
        return;
      }

      data.results.forEach((result: { fieldType: string; content: string }) => {
        console.log("Processing result:", result);
        
        const fieldTypeKey = result.fieldType.split(' ')[0];
        
        switch (fieldTypeKey) {
          case "Find":
            updateEditableField("companyName", cleanContent(result.content));
            break;
          case "Determine":
            updateEditableField("industrySector", result.content);
            break;
          case "Provide":
            updateEditableField("companyOverview", result.content);
            break;
          case "BRIEFLY":
            updateEditableField("coreProducts", result.content);
            break;
          case "Identify":
            if (result.fieldType.includes("Unique")) {
              updateEditableField("uniqueSellingPoint", result.content);
            } else if (result.fieldType.includes("target")) {
              updateEditableField("demographic", result.content);
            }
            break;
          case "Investigate":
            updateEditableField("geographic", result.content);
            break;
          default:
            console.log("Unhandled field type key:", fieldTypeKey, "Full type:", result.fieldType);
        }
      });

    } catch (error) {
      console.error("Autofill failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormFieldUpdate = (field: string, value: string | boolean) => {
    updateFormField(field as keyof FormData, value);
  };

  const handleEditableFieldUpdate = (field: string, value: string) => {
    updateEditableField(field as keyof EditableFields, value);
  };

  const isFormValid = (): boolean => {
    return Boolean(
      formData.companyName &&
      formData.companyWebsite &&
      formData.annualTurnover &&
      formData.primaryLocation &&
      formData.termsAccepted
    );
  };

  const handleNext = () => {
    // Save current form state to session storage
    saveToSessionStorage({
      companySetup: formData,
      editableFields: editableFields,
      currentStep: 'companySetup'
    });
    window.scrollTo(0, 0);
    onNext();
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
    console.log("Editable fields updated:", editableFields);
  }, [formData, editableFields]);

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <CompanyInfo />
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-12 py-12 w-full max-md:px-5 max-md:max-w-full">
            <ProgressIndicator />
            <main className="flex flex-col mt-16 w-full max-md:mt-10 max-md:max-w-full">
              <section className="flex flex-col w-full max-md:max-w-full">
                <h1 className="text-2xl font-semibold text-neutral-950 max-md:max-w-full">
                  Welcome to Skim!
                </h1>
                <p className="mt-2 text-base text-zinc-600 max-md:max-w-full">
                  Let's set up your organization.
                </p>
                <FormSection
                  formData={formData}
                  dropdownOptions={dropdownOptions}
                  updateFormField={handleFormFieldUpdate}
                  updateEditableField={handleEditableFieldUpdate}
                />
                <AutoFillButton
                  onClick={handleAutofill}
                  isLoading={isLoading}
                  disabled={!formData.companyWebsite}
                />
                <TextAreaField
                  label="Industry Sector"
                  value={editableFields.industrySector}
                  onChange={(value) =>
                    handleEditableFieldUpdate("industrySector", value)
                  }
                  placeholder="Enter industry sector or wait for auto-fill"
                />
                <TextAreaField
                  label="Company Overview"
                  value={editableFields.companyOverview}
                  onChange={(value) =>
                    handleEditableFieldUpdate("companyOverview", value)
                  }
                  placeholder="Enter company overview or wait for auto-fill"
                />
                <TextAreaField
                  label="Core Products / Service"
                  value={editableFields.coreProducts}
                  onChange={(value) =>
                    handleEditableFieldUpdate("coreProducts", value)
                  }
                  placeholder="Enter core products/services or wait for auto-fill"
                />
                <TextAreaField
                  label="Demographic"
                  value={editableFields.demographic}
                  onChange={(value) =>
                    handleEditableFieldUpdate("demographic", value)
                  }
                  placeholder="Enter demographic information or wait for auto-fill"
                />
                <TextAreaField
                  label="Unique Selling Point"
                  value={editableFields.uniqueSellingPoint}
                  onChange={(value) =>
                    handleEditableFieldUpdate("uniqueSellingPoint", value)
                  }
                  placeholder="Enter unique selling points or wait for auto-fill"
                />
                <TextAreaField
                  label="Geographic"
                  value={editableFields.geographic}
                  onChange={(value) => handleEditableFieldUpdate("geographic", value)}
                  placeholder="Enter geographic information or wait for auto-fill"
                />
                <TermsCheckbox
                  checked={formData.termsAccepted}
                  onChange={(value) => handleFormFieldUpdate("termsAccepted", value)}
                />
                <SubmitButton
                  isValid={isFormValid()}
                  onClick={handleNext}
                />
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
