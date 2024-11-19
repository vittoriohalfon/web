import * as dynamoose from 'dynamoose';

// Define the interface for type safety
export interface ICompanyProfile {
  clerkUserId: string;
  companyName?: string;
  companyWebsite?: string;
  annualTurnover?: string;
  locationOfBusiness?: string;
  govTenderExperience?: boolean;
  industrySector?: string;
  companyOverview?: string;
  coreProductsServices?: string[];
  demographic?: string[];
  uniqueSellingPoint?: string;
  geographicFocus?: string;
  savedContracts?: string[];
}

// Define schema
const companySchema = new dynamoose.Schema({
  clerkUserId: {
    type: String,
    hashKey: true,
  },
  companyName: String,
  companyWebsite: String,
  annualTurnover: String,
  locationOfBusiness: String,
  govTenderExperience: Boolean,
  industrySector: String,
  companyOverview: String,
  coreProductsServices: {
    type: Array,
    schema: [String]
  },
  demographic: {
    type: Array,
    schema: [String]
  },
  uniqueSellingPoint: String,
  geographicFocus: String,
  savedContracts: {
    type: Array,
    schema: [String]
  }
});

// Create model
// Using 'any' as a temporary workaround for the type constraint issue
export const CompanyProfile = dynamoose.model<any>('CompanyProfiles', companySchema); 