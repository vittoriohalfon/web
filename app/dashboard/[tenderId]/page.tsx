import { TenderDetails } from '@/components/TenderDetails';
import { Metadata } from 'next';

interface Props {
  params: {
    tenderId: string;
  };
}

export const metadata: Metadata = {
  title: 'Tender Details',
  description: 'Detailed information about the tender',
};

export default function TenderDetailsPage({ params }: Props) {
  return <TenderDetails tenderId={params.tenderId} />;
} 