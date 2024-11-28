import React, { useState, useEffect } from "react";
import { CheckboxField } from "../shared/CheckboxField";
import { AutoFillButton } from "../shared/AutoFillButton";
import { InfoIcon } from "lucide-react";

// Define the form data interface
export interface FormData {
  companyName: string;
  website: string;
  turnover: string;
  location: string;
  experienceWithTenders: boolean;
  industrySector: string;
  companyOverview: string;
  coreProductsServices: string;
  demographic: string;
  uniqueSellingPoint: string;
  geographicFocus: string;
}

// Add default form values
const DEFAULT_FORM_DATA: FormData = {
  companyName: '',
  website: '',
  turnover: '',
  location: '',
  experienceWithTenders: false,
  industrySector: '',
  companyOverview: '',
  coreProductsServices: '',
  demographic: '',
  uniqueSellingPoint: '',
  geographicFocus: ''
};

interface MappedResult {
  fieldType: string;
  content: string;
}

interface ProfileFormProps {
  profile: FormData | null; // Update to allow null
  loading: boolean;
  saving: boolean;
  saved: boolean;
  onUpdateProfile: (data: FormData) => void;
}

const COUNTRIES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", 
  "Czech Republic", "Denmark", "Estonia", "Finland", "France",
  "Germany", "Greece", "Hungary", "Ireland", "Italy", 
  "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
  "Norway", "Poland", "Portugal", "Romania", "Slovakia", 
  "Slovenia", "Spain", "Sweden", "Other (please specify)"
];

const TURNOVER_OPTIONS = [
  "Less than €1M", "€1M - €5M", "€5M - €10M", "€10M+"
];

// Add this new function at the top of the component, after the useState declarations
const autoResizeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const textarea = e.target;
  // Reset height to auto first
  textarea.style.height = 'auto';
  // Add a small buffer (2px) to prevent flickering
  textarea.style.height = `${textarea.scrollHeight + 2}px`;
};

const InfoTooltip: React.FC = () => {
  return (
    <div className="group relative inline-block ml-1">
      <InfoIcon className="h-4 w-4 text-gray-500 cursor-help" />
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
        If you must change your website, please{' '}
        <a 
          href="mailto:justin@justskim.ai" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 underline"
        >
          contact us!
        </a>
        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile: initialProfile,
  loading,
  saving,
  saved,
  onUpdateProfile,
}) => {
  // Group all useState hooks together at the top
  const [formData, setFormData] = useState<FormData>(initialProfile || DEFAULT_FORM_DATA);
  const [isAutofilling, setIsAutofilling] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFormData(initialProfile);
    }
  }, [initialProfile]);

  useEffect(() => {
    // Get all textareas in the form
    const textareas = document.querySelectorAll('textarea');
    
    // Adjust height for each textarea
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [formData]); // This will run whenever formData changes

  if (loading) {
    return <div>Loading...</div>;
  }

  // Modify the handleInputChange function to include auto-resizing for textareas
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAutoFill = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.website) {
      console.warn('No website URL available for auto-fill');
      return;
    }

    try {
      setIsAutofilling(true);
      const response = await fetch("/api/autofill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: formData.website }),
      });

      if (!response.ok) {
        throw new Error("Failed to autofill profile");
      }

      const { results } = await response.json();
      
      if (results && results.length > 0) {
        // Map the results based on fieldType
        const mappedData = results.reduce((acc: FormData, result: MappedResult) => {
          switch (result.fieldType) {
            case 'Determine the specific industry or sector of the given company':
              acc.industrySector = result.content;
              break;
            case 'Provide a VERY CONCISE overview of the company associated with the given domain':
              acc.companyOverview = result.content;
              break;
            case 'BRIEFLY describe core products and services offered by the company associated with the given domain':
              acc.coreProductsServices = result.content;
              break;
            case 'Identify the target audience of the company associated with the given domain':
              acc.demographic = result.content;
              break;
            case 'Identify the Unique Selling Proposition (USP) of the company associated with the given domain':
              acc.uniqueSellingPoint = result.content;
              break;
          }
          return acc;
        }, {});

        setFormData(prev => ({
          ...prev,
          ...mappedData
        }));
      }
    } catch (err) {
      console.error("Error during autofill:", err);
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onUpdateProfile(formData);
      }}
    >
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex flex-col w-full bg-white max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex flex-col w-full leading-tight max-md:max-w-full">
              <h1 className="text-2xl font-semibold text-neutral-950 max-md:max-w-full">
                Company Profile
              </h1>
              <p className="body-text-slim">
                Let&apos;s set up your organization.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-start mt-8 w-full text-neutral-950 max-md:max-w-full">
              <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
                <label
                  htmlFor="companyName"
                  className="text-sm font-medium max-md:max-w-full"
                >
                  Company Name*
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
                <label
                  htmlFor="companyWebsite"
                  className="text-sm font-medium max-md:max-w-full flex items-center"
                >
                  Company Website
                  <InfoTooltip />
                </label>
                <input
                  type="url"
                  id="companyWebsite"
                  className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base whitespace-nowrap bg-gray-50 rounded-lg border border-solid border-zinc-300 max-md:max-w-full cursor-not-allowed"
                  value={formData.website}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-4 w-full text-neutral-950 max-md:max-w-full">
            <label
              htmlFor="annualTurnover"
              className="text-sm font-medium max-md:max-w-full"
            >
              Annual Turnover Estimation*
            </label>
            <select
              id="annualTurnover"
              className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full"
              value={formData.turnover}
              onChange={(e) => handleInputChange('turnover', e.target.value)}
            >
              {TURNOVER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mt-4 w-full text-neutral-950 max-md:max-w-full">
            <label
              htmlFor="businessLocation"
              className="text-sm font-medium max-md:max-w-full"
            >
              What is your primary location of business instead of the
              geographic location of business?
            </label>
            <select
              id="businessLocation"
              className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mt-4 w-full max-md:max-w-full">
            <div className="flex justify-between items-center">
              <CheckboxField
                label="Do you have experience applying for government tenders?"
                checked={formData.experienceWithTenders}
                onChange={(value) => handleInputChange('experienceWithTenders', value)}
              />
              <AutoFillButton 
                onClick={handleAutoFill}
                disabled={!formData.website}
                isLoading={isAutofilling}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-12 w-full text-neutral-950 max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <label
              htmlFor="industrySector"
              className="text-sm font-medium max-md:max-w-full"
            >
              Industry Sector
            </label>
            <textarea
              id="industrySector"
              className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full overflow-hidden transition-height duration-200"
              value={formData.industrySector}
              onChange={(e) => {
                handleInputChange('industrySector', e.target.value);
                autoResizeTextArea(e);
              }}
              style={{
                resize: 'none',
                minHeight: '60px',
                height: 'auto',
                boxSizing: 'border-box',
              }}
            ></textarea>
          </div>
          <div className="flex flex-col mt-4 w-full max-md:max-w-full">
            <label
              htmlFor="companyOverview"
              className="text-sm font-medium max-md:max-w-full"
            >
              Company Overview
            </label>
            <textarea
              id="companyOverview"
              className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base leading-6 bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full overflow-hidden transition-height duration-200"
              rows={4}
              value={formData.companyOverview}
              onChange={(e) => {
                handleInputChange('companyOverview', e.target.value);
                autoResizeTextArea(e);
              }}
              style={{ 
                resize: 'none', 
                minHeight: '106px',
                height: 'auto',
                boxSizing: 'border-box'
              }}
            ></textarea>
          </div>
          <div className="flex flex-col justify-center mt-4 w-full max-md:max-w-full">
            <div className="flex flex-col w-full max-md:max-w-full">
              <label
                htmlFor="coreProducts"
                className="text-sm font-medium max-md:max-w-full"
              >
                Core Products / Service
              </label>
              <textarea
                id="coreProducts"
                className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base leading-6 bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full overflow-hidden transition-height duration-200"
                rows={4}
                value={formData.coreProductsServices}
                onChange={(e) => {
                  handleInputChange('coreProductsServices', e.target.value);
                  autoResizeTextArea(e);
                }}
                style={{ 
                  resize: 'none', 
                  minHeight: '106px',
                  height: 'auto',
                  boxSizing: 'border-box'
                }}
              ></textarea>
            </div>
            <div className="flex flex-col mt-4 w-full max-md:max-w-full">
              <label
                htmlFor="demographic"
                className="text-sm font-medium max-md:max-w-full"
              >
                Demographic
              </label>
              <textarea
                id="demographic"
                className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base leading-6 bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full overflow-hidden transition-height duration-200"
                rows={4}
                value={formData.demographic}
                onChange={(e) => {
                  handleInputChange('demographic', e.target.value);
                  autoResizeTextArea(e);
                }}
                style={{ 
                  resize: 'none', 
                  minHeight: '106px',
                  height: 'auto',
                  boxSizing: 'border-box'
                }}
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col justify-center mt-4 w-full max-md:max-w-full">
            <div className="flex flex-col w-full max-md:max-w-full">
              <label
                htmlFor="uniqueSellingPoint"
                className="text-sm font-medium max-md:max-w-full"
              >
                Unique Selling Point
              </label>
              <textarea
                id="uniqueSellingPoint"
                className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base leading-6 bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full overflow-hidden transition-height duration-200"
                rows={3}
                value={formData.uniqueSellingPoint}
                onChange={(e) => {
                  handleInputChange('uniqueSellingPoint', e.target.value);
                  autoResizeTextArea(e);
                }}
                style={{ 
                  resize: 'none', 
                  minHeight: '106px',
                  height: 'auto',
                  boxSizing: 'border-box'
                }}
              ></textarea>
            </div>
            <div className="flex flex-col mt-4 w-full max-md:max-w-full">
              <label
                htmlFor="geographic"
                className="text-sm font-medium max-md:max-w-full"
              >
                Geographic
              </label>
              <textarea
                id="geographic"
                className="flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base leading-6 bg-white rounded-lg border border-solid border-zinc-300 max-md:max-w-full overflow-hidden transition-height duration-200"
                rows={4}
                value={formData.geographicFocus}
                onChange={(e) => {
                  handleInputChange('geographicFocus', e.target.value);
                  autoResizeTextArea(e);
                }}
                style={{ 
                  resize: 'none', 
                  minHeight: '106px',
                  height: 'auto',
                  boxSizing: 'border-box'
                }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6 w-full text-base text-center text-white whitespace-nowrap max-md:max-w-full">
          <div className="flex flex-col items-end w-full max-md:max-w-full">
            <button
              type="submit"
              className="flex gap-2 justify-center items-center px-4 py-2.5 bg-indigo-700 rounded-lg border border-indigo-600 border-solid"
              disabled={saving}
            >
              {saving ? (
                <span>Saving...</span>
              ) : saved ? (
                <span>Saved!</span>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
