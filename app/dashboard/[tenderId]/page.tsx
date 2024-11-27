import { TenderDetails } from '@/components/TenderDetails/TenderDetails';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    tenderId: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Tender Details',
  description: 'Detailed information about the tender',
};

export default async function TenderDetailsPage({ params }: Props) {
  const { tenderId } = await params;
  return <TenderDetails tenderId={tenderId} />;
}