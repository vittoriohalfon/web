"use client";
import { builder, Builder } from "@builder.io/react";
import { AchievementGoal } from "./components/CompanySetup/AchievementGoal";
import { AutoFillButton } from "./components/CompanySetup/AutoFillButton";
import { CheckboxField } from "./components/CompanySetup/CheckboxField";
import { CompanyInfo } from "./components/CompanySetup/CompanyInfo";
import { CompanySetupForm } from "./components/CompanySetup/CompanySetupForm";
import { CountryFilter } from "./components/TenderDashboard/CountryFilter";
import { CountryItem } from "./components/TenderDashboard/CountryItem";
import { FileUploader } from "./components/CompanySetup/FileUploader";
import { FilterBar } from "./components/TenderDashboard/FilterBar";
import { FilterDropdown } from "./components/TenderDashboard/FilterDropdown";
import { FormSection } from "./components/CompanySetup/FormSection";
import { InputField } from "./components/CompanySetup/InputField";
import { NavigationButtons } from "./components/CompanySetup/NavigationButtons";
import { PastPerformance } from "./components/CompanySetup/PastPerformance";
import { ProgressBar } from "./components/CompanySetup/ProgressBar";
import { ProgressIndicator } from "./components/CompanySetup/ProgressIndicator";
import { SelectField } from "./components/CompanySetup/SelectField";
import { SubmitButton } from "./components/CompanySetup/SubmitButton";
import { TenderCard } from "./components/TenderDashboard/TenderCard";
import { TenderDashboard } from "./components/TenderDashboard/TenderDashboard";
import { TermsCheckbox } from "./components/CompanySetup/TermsCheckbox";
import { TextAreaField } from "./components/CompanySetup/TextAreaField";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

Builder.registerComponent(AutoFillButton, {
  name: "AutoFillButton",
  inputs: [
    {
      name: "isLoading",
      type: "boolean",
      required: true,
    },
  ],
});

Builder.registerComponent(CheckboxField, {
  name: "CheckboxField",
  inputs: [
    {
      name: "checked",
      type: "boolean",
      required: true,
    },
    {
      name: "label",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(CompanyInfo, {
  name: "CompanyInfo",
});

Builder.registerComponent(CompanySetupForm, {
  name: "CompanySetupForm",
});

Builder.registerComponent(FormSection, {
  name: "FormSection",
  inputs: [
    {
      name: "dropdownOptions",
      type: "string",
      meta: {
        ts: "DropdownOptions",
      },
      required: true,
    },
    {
      name: "formData",
      type: "string",
      meta: {
        ts: "FormData",
      },
      required: true,
    },
    {
      name: "updateEditableField",
      type: "object",
      hideFromUI: true,
      meta: {
        ts: "(field: string | number | symbol, value: string) => void",
      },
      required: true,
    },
    {
      name: "updateFormField",
      type: "object",
      hideFromUI: true,
      meta: {
        ts: "(field: string | number | symbol, value: string | boolean) => void",
      },
      required: true,
    },
  ],
});

Builder.registerComponent(InputField, {
  name: "InputField",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
    {
      name: "placeholder",
      type: "string",
      required: true,
    },
    {
      name: "type",
      type: "string",
    },
    {
      name: "value",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(ProgressIndicator, {
  name: "ProgressIndicator",
});

Builder.registerComponent(SelectField, {
  name: "SelectField",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
    {
      name: "options",
      type: "object",
      hideFromUI: true,
      meta: {
        ts: "string[]",
      },
      required: true,
    },
    {
      name: "placeholder",
      type: "string",
      required: true,
    },
    {
      name: "value",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(SubmitButton, {
  name: "SubmitButton",
  inputs: [
    {
      name: "isValid",
      type: "boolean",
      required: true,
    },
  ],
});

Builder.registerComponent(TermsCheckbox, {
  name: "TermsCheckbox",
  inputs: [
    {
      name: "checked",
      type: "boolean",
      required: true,
    },
  ],
});

Builder.registerComponent(TextAreaField, {
  name: "TextAreaField",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
    {
      name: "placeholder",
      type: "string",
      required: true,
    },
    {
      name: "value",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(FileUploader, {
  name: "FileUploader",
});

Builder.registerComponent(NavigationButtons, {
  name: "NavigationButtons",
  inputs: [
    {
      name: "isUploadDisabled",
      type: "boolean",
      required: true,
    },
    {
      name: "isUploading",
      type: "boolean",
      required: true,
    },
  ],
});

Builder.registerComponent(PastPerformance, {
  name: "PastPerformance",
});

Builder.registerComponent(ProgressBar, {
  name: "ProgressBar",
  inputs: [
    {
      name: "currentStep",
      type: "number",
      required: true,
    },
  ],
});

Builder.registerComponent(AchievementGoal, {
  name: "AchievementGoal",
  inputs: [
    {
      name: "initialGoal",
      type: "string",
    },
  ],
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(FilterBar, {
  name: "FilterBar",
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(FilterBar, {
  name: "FilterBar",
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(FilterBar, {
  name: "FilterBar",
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(FilterBar, {
  name: "FilterBar",
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(FilterDropdown, {
  name: "FilterDropdown",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(TenderDashboard, {
  name: "TenderDashboard",
});

Builder.registerComponent(TenderDashboard, {
  name: "TenderDashboard",
});

Builder.registerComponent(FilterDropdown, {
  name: "FilterDropdown",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(CountryItem, {
  name: "CountryItem",
  inputs: [
    {
      name: "country",
      type: "string",
      required: true,
    },
    {
      name: "flag",
      type: "string",
    },
    {
      name: "isSelected",
      type: "boolean",
      required: true,
    },
  ],
});

Builder.registerComponent(CountryFilter, {
  name: "CountryFilter",
});

Builder.registerComponent(FilterBar, {
  name: "FilterBar",
});

Builder.registerComponent(FilterDropdown, {
  name: "FilterDropdown",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(FilterDropdown, {
  name: "FilterDropdown",
  inputs: [
    {
      name: "label",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(TenderDashboard, {
  name: "TenderDashboard",
});

Builder.registerComponent(TenderCard, {
  name: "TenderCard",
  inputs: [
    {
      name: "tender",
      type: "object",
      hideFromUI: true,
      meta: {
        ts: "{ title: string; description: string; match: number; budget: string; country: string; countryFlag: string; lots: number; status: string; posted: string; submissionDate: string; dueIn: string; }",
      },
      required: true,
    },
  ],
});

Builder.registerComponent(TenderDashboard, {
  name: "TenderDashboard",
});
