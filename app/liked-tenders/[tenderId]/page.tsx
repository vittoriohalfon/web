import { TenderDetails } from '@/components/TenderDetails/TenderDetails';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    tenderId: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Liked Tender Details',
  description: 'Detailed information about your liked tender',
};

export default async function LikedTenderDetailsPage({ params }: Props) {
  const { tenderId } = await params;
  return <TenderDetails tenderId={tenderId} match_percentage={0} />;
} 