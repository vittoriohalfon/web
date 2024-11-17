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

interface FormSectionProps {
  formData: FormData;
  dropdownOptions: DropdownOptions;
  updateFormField: (field: keyof FormData, value: string | boolean) => void;
  updateEditableField: (field: keyof EditableFields, value: string) => void;
}

interface CompanySetupFormProps {
  onNext: () => void;
}

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
    setIsLoading(true);
    try {
      const response = await fetch("/api/autofill", {
        method: "POST",
        body: JSON.stringify({ website: formData.companyWebsite }),
      });
      const data = await response.json();
      setFormData({ ...formData, ...data });
    } catch (error) {
      console.error("Autofill failed:", error);
    }
    setIsLoading(false);
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
    window.scrollTo(0, 0);
    onNext();
  };

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
