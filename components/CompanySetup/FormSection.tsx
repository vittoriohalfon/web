import React from "react";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { CheckboxField } from "../shared/CheckboxField";
import { InfoIcon } from "lucide-react";
import type { FormData, DropdownOptions } from "@/components/CompanySetup/types";

interface FormSectionProps {
  formData: FormData;
  dropdownOptions: DropdownOptions;
  updateFormField: (field: string, value: string | boolean) => void;
  updateEditableField: (field: string, value: string) => void;
}

const InfoTooltip: React.FC = () => {
  return (
    <div className="group relative inline-block ml-1">
      <InfoIcon className="h-4 w-4 text-gray-500 cursor-help" />
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
        You will not be able to change your company website later! Please ensure it is correct.
        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export const FormSection: React.FC<FormSectionProps> = ({
  formData,
  dropdownOptions,
  updateFormField,
  updateEditableField,
}) => {
  return (
    <div className="flex flex-col w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-4 items-start mt-8 w-full text-neutral-950 max-md:max-w-full">
        <InputField
          label="Company Name*"
          value={formData.companyName}
          onChange={(value) => updateEditableField("companyName", value)}
          placeholder="Enter company name"
        />
        <div className="flex-1 shrink basis-0 min-w-[240px]">
          <div className="flex items-center">
            <span className="text-sm font-medium">Company Website*</span>
            <InfoTooltip />
          </div>
          <InputField
            value={formData.companyWebsite}
            onChange={(value) => updateEditableField("companyWebsite", value)}
            placeholder="Enter company website"
            type="url"
            hideLabel
          />
        </div>
      </div>
      <SelectField
        label="Annual Turnover Estimation*"
        value={formData.annualTurnover}
        onChange={(value) => updateFormField("annualTurnover", value)}
        options={dropdownOptions.turnover}
        placeholder="Select Annual Turnover Estimation"
      />
      <SelectField
        label="What is your primary location of business?"
        value={formData.primaryLocation}
        onChange={(value) => updateFormField("primaryLocation", value)}
        options={dropdownOptions.locations}
        placeholder="Select Your Primary Location"
      />
      <CheckboxField
        label="Do you have experience applying for government tenders?"
        checked={formData.hasTenderExperience}
        onChange={(value) => updateFormField("hasTenderExperience", value)}
      />
    </div>
  );
};
