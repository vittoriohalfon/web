export interface FormData {
  companyName: string;
  companyWebsite: string;
  annualTurnover: string;
  primaryLocation: string;
  hasTenderExperience: boolean;
  termsAccepted: boolean;
}

export interface EditableFields {
  companyName: string;
  companyWebsite: string;
  industrySector: string;
  companyOverview: string;
  coreProducts: string;
  demographic: string;
  uniqueSellingPoint: string;
  geographic: string;
}

export interface DropdownOptions {
  turnover: string[];
  locations: string[];
}

export enum SetupStep {
  CompanySetup = 1,
  PastPerformance = 2,
  FinalSteps = 3
} 