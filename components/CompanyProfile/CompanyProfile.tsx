"use client";

import React, { useState, useEffect } from "react";
import { ProfileForm } from "./ProfileForm";
import { Header } from "./Header";
import { Sidebar } from "../shared/Sidebar";
import { useRouter } from "next/navigation";

interface CompanyData {
  name: string;
  website: string;
  annualTurnover: string;
  primaryLocation: string;
  experienceWithTenders: boolean;
  industrySector: string;
  companyOverview: string;
  coreProductsServices: string;
  demographic: string;
  uniqueSellingPoint: string;
  geographicFocus: string;
}

interface FormattedProfile {
  companyName: string;
  website: string;
  turnover: string;
  location: string;
  experienceWithTenders: boolean;
  industrySector: string;
  companyOverview: string;
  coreProducts: string;
  demographic: string;
  uniqueSellingPoint: string;
  geographic: string;
}

export const CompanyProfile: React.FC = () => {
  const [profile, setProfile] = useState<FormattedProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatCompanyData = (data: CompanyData): FormattedProfile => ({
    companyName: data.name,
    website: data.website || "",
    turnover: data.annualTurnover || "",
    location: data.primaryLocation || "",
    experienceWithTenders: data.experienceWithTenders,
    industrySector: data.industrySector || "",
    companyOverview: data.companyOverview || "",
    coreProducts: data.coreProductsServices || "",
    demographic: data.demographic || "",
    uniqueSellingPoint: data.uniqueSellingPoint || "",
    geographic: data.geographicFocus || "",
  });

  const formatProfileForApi = (data: FormattedProfile): CompanyData => ({
    name: data.companyName,
    website: data.website,
    annualTurnover: data.turnover,
    primaryLocation: data.location,
    experienceWithTenders: data.experienceWithTenders,
    industrySector: data.industrySector,
    companyOverview: data.companyOverview,
    coreProductsServices: data.coreProducts,
    demographic: data.demographic,
    uniqueSellingPoint: data.uniqueSellingPoint,
    geographicFocus: data.geographic,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const response = await fetch("/api/get-profile");
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(formatCompanyData(data));
      setError(null);
    } catch (err) {
      setError("Failed to load profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(data: FormattedProfile) {
    try {
      setSaving(true);
      const response = await fetch("/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setProfile(formatCompanyData(updatedData));
      setSaved(true);
      setError(null);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setError("Failed to save profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex overflow-hidden flex-wrap items-start p-0 m-0 w-screen min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 shrink ml-80 basis-8 min-w-[240px] max-md:ml-60 max-md:max-w-full">
        <Header />
        <section className="flex flex-col p-6 w-full max-md:px-5 max-md:max-w-full">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <ProfileForm
            profile={profile}
            loading={loading}
            saving={saving}
            saved={saved}
            onUpdateProfile={updateProfile}
          />
        </section>
      </div>
    </main>
  );
};
