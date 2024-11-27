import React from "react";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { CheckboxField } from "../shared/CheckboxField";
import type { FormData, EditableFields, DropdownOptions } from "@/components/CompanySetup/types";

interface FormSectionProps {
  formData: FormData;
  dropdownOptions: DropdownOptions;
  updateFormField: (field: string, value: string | boolean) => void;
  updateEditableField: (field: string, value: string) => void;
}

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
        <InputField
          label="Company Website*"
          value={formData.companyWebsite}
          onChange={(value) => updateEditableField("companyWebsite", value)}
          placeholder="Enter company website"
          type="url"
        />
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
