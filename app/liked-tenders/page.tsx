'use client';

import { TenderDashboard } from "@/components/TenderDashboard";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Tender } from "@/types/tender";

export default function LikedTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchLikedTenders = async () => {
      try {
        const sessionToken = await getToken();
        
        // First, get the list of liked tender IDs
        const likedIdsResponse = await fetch('/api/user/get-liked-tenders', {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
        
        if (!likedIdsResponse.ok) {
          throw new Error('Failed to fetch liked tender IDs');
        }

        const { noticeIds } = await likedIdsResponse.json();

        // Then fetch details for each tender using the liked-basic endpoint
        const tenderDetailsPromises = noticeIds.map(async (noticeId: string) => {
          const response = await fetch('/api/aurora/liked-basic', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({ noticeId }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch details for tender ${noticeId}`);
          }

          return response.json();
        });

        const tenderDetails = await Promise.all(tenderDetailsPromises);

        // Transform the data to match the Tender type
        const transformedTenders = tenderDetails.map((tender): Tender => ({
          id: tender.noticeId,
          notice_id: tender.noticeId,
          title: tender.title,
          description: tender.description,
          match_percentage: 0,
          amount: tender.estimatedValue,
          currency: tender.currency,
          country: tender.country,
          lot_count: tender.lot_count,
          status: 'green',
          published: tender.published,
          deadline: tender.deadline,
          isLiked: true,
        }));

        setTenders(transformedTenders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load liked tenders');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedTenders();
  }, [getToken]);

  return <TenderDashboard tenders={tenders} loading={loading} error={error} />;
}
