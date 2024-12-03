"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ProfileForm } from "./ProfileForm";
import { Header } from "../shared/Header";
import { Sidebar } from "../shared/Sidebar";
import { useRouter } from "next/navigation";
import { FormData } from "./ProfileForm";

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
  userCreatedAt: string;
}

export const CompanyProfile: React.FC = () => {
  const [profile, setProfile] = useState<FormData | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatCompanyData = (data: CompanyData): FormData => {
    setUserCreatedAt(data.userCreatedAt);

    return {
      companyName: data.name,
      website: data.website || "",
      turnover: data.annualTurnover || "",
      location: data.primaryLocation || "",
      experienceWithTenders: data.experienceWithTenders,
      industrySector: data.industrySector || "",
      companyOverview: data.companyOverview || "",
      coreProductsServices: data.coreProductsServices || "",
      demographic: data.demographic || "",
      uniqueSellingPoint: data.uniqueSellingPoint || "",
      geographicFocus: data.geographicFocus || "",
    };
  };

  const formatProfileForApi = (data: FormData): CompanyData => ({
    name: data.companyName,
    website: data.website,
    annualTurnover: data.turnover,
    primaryLocation: data.location,
    experienceWithTenders: data.experienceWithTenders,
    industrySector: data.industrySector,
    companyOverview: data.companyOverview,
    coreProductsServices: data.coreProductsServices,
    demographic: data.demographic,
    uniqueSellingPoint: data.uniqueSellingPoint,
    geographicFocus: data.geographicFocus,
    userCreatedAt: userCreatedAt,
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/get-profile");

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
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function updateProfile(data: FormData) {
    try {
      setSaving(true);
      const apiData = formatProfileForApi(data);
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setProfile(formatCompanyData(updatedData));
      setSaved(true);

      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (err) {
      setError("Failed to save profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex overflow-hidden bg-white">
      <Sidebar />
      <main className="flex flex-col flex-1 ml-[312px] min-w-[240px] max-md:max-w-full">
        <Header userCreatedAt={new Date()} showNav={true} />
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
      </main>
    </div>
  );
};