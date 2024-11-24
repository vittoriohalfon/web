'use client';

import { TenderDashboard } from "@/components/TenderDashboard";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Tender {
  title: string;
  description: string;
  amount: number | null;
  currency: string | null;
  status: string;
  match_percentage: number;
  published: string;
  lot_count: number;
  deadline?: string;
  country: string | null;
  id: string;
}

export default function DashboardPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const sessionToken = await getToken();
        
        const response = await fetch('/api/similarity-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tenders');
        }

        const data = await response.json();
        setTenders(data.contracts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tenders');
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [getToken]);

  return <TenderDashboard tenders={tenders} loading={loading} error={error} />;
}
