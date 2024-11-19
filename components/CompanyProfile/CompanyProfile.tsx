"use client";

import React, { useState, useEffect } from "react";
import { ProfileForm } from "./ProfileForm";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface CompanyProfileProps {
  // Add any props if needed
}

// Add this mock data at the top of the file
const MOCK_PROFILE = {
  companyName: "Test Company",
  website: "https://example.com",
  turnover: "€5M - 15M",
  location: "France",
  industrySector: "Technology",
  companyOverview: "A leading technology company...",
  coreProducts: "Software development, Cloud solutions, AI services",
  demographic: "Enterprise businesses, Government organizations",
  uniqueSellingPoint: "Innovative AI-powered solutions with proven track record",
  geographic: "Operating across Europe with main office in Paris",
};

export const CompanyProfile: React.FC<CompanyProfileProps> = () => {
  const [profile, setProfile] = useState<any>(MOCK_PROFILE);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProfile(MOCK_PROFILE);
    setLoading(false);
  }

  async function updateProfile(data: any) {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfile(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  return (
    <main className="flex overflow-hidden flex-wrap items-start p-0 m-0 w-screen min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 shrink ml-80 basis-8 min-w-[240px] max-md:ml-60 max-md:max-w-full">
        <Header />
        <section className="flex flex-col p-6 w-full max-md:px-5 max-md:max-w-full">
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
